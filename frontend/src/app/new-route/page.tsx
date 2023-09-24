"use client";
import type {
    DirectionsResponseData,
    FindPlaceFromTextResponseData,
} from "@googlemaps/google-maps-services-js";
import { FormEvent, useRef, useState } from "react";
import { useMap } from "../hooks/useMap";

export function NewRoute() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const map = useMap(mapContainerRef);
    const [directionsData, setDirectionsData] = useState<
        DirectionsResponseData & { request: any }
    >();

    async function searchLocation(event: FormEvent) {
        event.preventDefault();

        const source = (document.getElementById("source") as HTMLInputElement)
            .value;
        const destination = (
            document.getElementById("destination") as HTMLInputElement
        ).value;

        if (source == (null || "") || destination == (null || "")) return;

        const [sourceResponse, destinationResponse] = await Promise.all([
            fetch(`http://localhost:3000/v1/api/places/?text=${source}`),
            fetch(`http://localhost:3000/v1/api/places/?text=${destination}`),
        ]);

        const [sourcePlace, destinationPlace]: FindPlaceFromTextResponseData[] =
            await Promise.all([
                sourceResponse.json(),
                destinationResponse.json(),
            ]);

        if (sourcePlace.status != "OK") {
            console.error("Erro na busca da API: ", sourcePlace);
            alert("Não foi possível encontrar a origem");
            return;
        }
        if (destinationPlace.status != "OK") {
            console.error("Erro na busca da API: ", destinationPlace);
            alert("Não foi possível encontrar o destino");
            return;
        }

        const sourcePlaceId = sourcePlace.candidates[0].place_id;
        const destinationPlaceId = destinationPlace.candidates[0].place_id;

        const directionsResponse = await fetch(
            `http://localhost:3000/v1/api/directions?originId=${sourcePlaceId}&destinationId=${destinationPlaceId}`
        );

        const directionsData: DirectionsResponseData & { request: any } =
            await directionsResponse.json();

        setDirectionsData(directionsData);

        map?.removeAllRoutes();
        await map?.addRouteWithIcons({
            routeId: "1",
            startMarkerOptions: {
                position: directionsData.routes[0].legs[0].start_location,
            },
            endMarkerOptions: {
                position: directionsData.routes[0].legs[0].end_location,
            },
            carMarkerOptions: {
                position: directionsData.routes[0].legs[0].start_location,
            },
        });
    }

    async function createRoute() {
        const startAddress = directionsData!.routes[0].legs[0].start_address;
        const endAddress = directionsData!.routes[0].legs[0].end_address;

        const response = await fetch("http://localhost:3000/v1/api/routes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: `${startAddress} - ${endAddress}`,
                source_id: directionsData!.request.origin.place_id,
                destination_id: directionsData!.request.destination.place_id,
            }),
        });

        const route = await response.json();
    }

    return (
        <section className="flex flex-row h-[100vh] w-full">
            <div id="sidebar_form">
                <form
                    className="flex flex-col p-4 space-y-2 max-w-lg"
                    onSubmit={searchLocation}
                >
                    <h1 className="text-3xl">New Route</h1>

                    <input
                        type="text"
                        id="source"
                        placeholder="Starting place"
                        className="rounded  text-white bg-black/10 border-gray-500 border p-2"
                    />
                    <input
                        type="text"
                        id="destination"
                        placeholder="Where you want to go"
                        className="rounded  text-white bg-black/10 border-gray-500 border p-2"
                    />
                    <button
                        type="submit"
                        className="rounded  justify-center flex align-middle text-white bg-black/10 border-gray-500 border p-2"
                    >
                        Search
                    </button>
                </form>

                {directionsData && (
                    <div className="p-4">
                        <ul>
                            <li>
                                Origin:{" "}
                                {directionsData.routes[0].legs[0].start_address}
                            </li>
                            <li>
                                Destiny:{" "}
                                {directionsData.routes[0].legs[0].end_address}
                            </li>
                            <li>
                                <button className="text-lg rounded py-1 px-2 text-black bg-slate-100" onClick={createRoute}>Create route</button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
            <div id="map" ref={mapContainerRef} className="w-full"></div>
        </section>
    );
}

export default NewRoute;
