"use client";
import { useEffect, useRef } from "react";
import { useMap } from "../hooks/useMap";
import { Route } from "@/utils/model";
import { socket } from "@/utils/socket-io";
import RouteSelect from "@/components/RouteSelect";
import { NEW_POINTS } from "@/utils/constants";

export function DriverPage() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const map = useMap(mapContainerRef);

    useEffect(() => {
        socket.connect();
        return () => {
            socket.disconnect();
        };
    }, []);

    async function startRoute() {
        const routeId = (document.getElementById("route") as HTMLSelectElement)
            .value;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_NEXT_API_URL}/routes/${routeId}`
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
            await sleep(2000);
            map?.moveCar(routeId, step.start_location);
            socket.emit(NEW_POINTS, {
                route_id: routeId,
                lat: step.start_location.lat,
                lng: step.start_location.lng,
            });

            await sleep(2000);
            map?.moveCar(routeId, step.end_location);
            socket.emit(NEW_POINTS, {
                route_id: routeId,
                lat: step.end_location.lat,
                lng: step.end_location.lng,
            });
        }
    }

    return (
        <section className="flex flex-row h-[100vh] w-full">
            <div id="sidebar_form">
                <div className="flex flex-col p-4 space-y-2 max-w-lg">
                    <h1 className="text-3xl">My routes</h1>

                    <RouteSelect id="routes" />

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
