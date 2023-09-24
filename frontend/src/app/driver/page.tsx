"use client";
import { useRef } from "react";
import { useMap } from "../hooks/useMap";
import useSWR from "swr";
import { fetcher } from "@/utils/http";
import { Route } from "@/utils/model";

export function DriverPage() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const map = useMap(mapContainerRef);

    // while the data did not load use a fallbackData with empty array
    const {
        data: routes,
        error,
        isLoading,
    } = useSWR<Route[]>("http://localhost:3000/v1/api/routes", fetcher, {
        fallbackData: [],
    });

    async function startRoute() {
        const routeId = (document.getElementById("route") as HTMLSelectElement)
            .value;

        const response = await fetch(
            `http://localhost:3000/v1/api/routes/${routeId}`
        );
        const route: Route = await response.json();

        map?.removeAllRoutes();
        await map?.addRouteWithIcons({
            routeId: routeId,
            startMarkerOptions: {
                position: route.directions.routes[0].legs[0].start_location,
            },
            endMarkerOptions: {
                position: route.directions.routes[0].legs[0].end_location,
            },
            carMarkerOptions: {
                position: route.directions.routes[0].legs[0].start_location,
            },
        });

        const { steps } = route.directions.routes[0].legs[0];

        for (const step of steps) {
            await sleep(2000)
            map?.moveCar(routeId, step.start_location)

            await sleep(2000)
            map?.moveCar(routeId, step.end_location)
        }
    }

    return (
        <section className="flex flex-row h-[100vh] w-full">
            <div id="sidebar_form">
                <div className="flex flex-col p-4 space-y-2 max-w-lg">
                    <h1 className="text-3xl">My routes</h1>

                    <select
                        id="route"
                        className="bg-black/10 border-gray-500 border rounded py-1 px-2"
                    >
                        {isLoading && <option>Loading routes...</option>}
                        {routes!.map((route) => (
                            <option key={route.id} value={route.id}>
                                {route.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="rounded  justify-center flex align-middle text-white bg-black/10 border-gray-500 border p-2"
                        onClick={startRoute}
                    >
                        Start a route
                    </button>
                </div>
            </div>
            <div id="map" ref={mapContainerRef} className="w-full"></div>
        </section>
    );
}

export default DriverPage;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
