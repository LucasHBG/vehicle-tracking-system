"use client";
import { FormEvent } from "react";

export function NewRoute() {
    async function searchLocation(event: FormEvent) {
        event.preventDefault();

        const source = (document.getElementById("source") as HTMLInputElement)
            .value;
        const destination = (
            document.getElementById("destination") as HTMLInputElement
        ).value;

        const [sourceResponse, destinationResponse] = await Promise.all([
            fetch(`https://localhost:3000/places/?text=${source}`),
            fetch(`https://localhost:3000/places/?text=${destination}`),
        ]);

        const [sourcePlace, destinationPlace] = await Promise.all([
            sourceResponse.json(),
            destinationResponse.json(),
        ])
        
    }

    return (
        <section className="flex">
            <div className="flex flex-col p-4 space-y-2">
                <input
                    type="text"
                    id="source"
                    placeholder="Starting place"
                    className="rounded w-48 text-white bg-black/10 border-gray-500 border p-2"
                />
                <input
                    type="text"
                    id="destination"
                    placeholder="Where you want to go"
                    className="rounded w-48 text-white bg-black/10 border-gray-500 border p-2"
                />
                <input
                    type="submit"
                    id="searchButton"
                    className="rounded w-48 text-white bg-black/10 border-gray-500 border p-2"
                    onSubmit={searchLocation}
                />
            </div>
        </section>
    );
}

export default NewRoute;
