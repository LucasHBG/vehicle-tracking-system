import { fetcher } from "@/utils/http";
import { Route } from "@/utils/model";
import { DetailedHTMLProps, SelectHTMLAttributes } from "react";
import useSWR from "swr";

type RouteSelectProps = DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
> & {
    onChange?: (place_id: string) => void;
};

export default function RouteSelect(props: RouteSelectProps) {
    const {
        data: routes,
        error,
        isLoading,
    } = useSWR<Route[]>(
        `${process.env.NEXT_PUBLIC_NEXT_API_URL}/routes`,
        fetcher,
        {
            fallbackData: [],
        }
    );

    return (
        <select
            {...props}
            onChange={(event) =>
                props.onChange && props.onChange(event.target.value)
            }
            className="bg-black/10 border-gray-500 border rounded py-1 px-2"
        >
            {isLoading && <option>Loading routes...</option>}
            {routes!.map((route) => (
                <option key={route.id} value={route.id}>
                    {route.name}
                </option>
            ))}
        </select>
    );
}
