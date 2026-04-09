import { useEffect, useState } from "react";

export interface Suggestion {
	id: string;
	name: string;
	city?: string;
	state?: string;
	country?: string;
	formattedText: string;
	coordinates?: {
		latitude: number;
		longitude: number;
	};
}

export function useLocationAutocomplete(
	query: string,
	lat?: number,
	lon?: number,
) {
	const [data, setData] = useState<Suggestion[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let isMounted = true;

		if (!query || query.trim().length < 2) {
			setData([]);
			setIsLoading(false);
			setError(null);
			return;
		}

		async function fetchLocations() {
			setIsLoading(true);
			setError(null);
			try {
				let url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
					query,
				)}&limit=5`;
				if (lat !== undefined && lon !== undefined) {
					url += `&lat=${lat}&lon=${lon}`;
				}

				const response = await fetch(url);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const json = await response.json();
				if (isMounted && json.features) {
					const suggestions: Suggestion[] = json.features
						.filter((f: any) => f.properties.name)
						.map((feature: any) => {
							const props = feature.properties;
							const coords = feature.geometry?.coordinates;
							const parts = [];
							if (props.name) parts.push(props.name);
							if (props.city && props.city !== props.name)
								parts.push(props.city);
							else if (props.county && props.county !== props.name)
								parts.push(props.county);
							if (props.state) parts.push(props.state);

							// Determine unique ID using osm_id or random fallback
							const id = props.osm_id
								? String(props.osm_id)
								: Math.random().toString();

							return {
								id,
								name: props.name || "",
								city: props.city,
								state: props.state,
								country: props.country,
								formattedText: parts.join(", "),
								coordinates: coords
									? { latitude: coords[1], longitude: coords[0] }
									: undefined,
							};
						});

					// Remove duplicates based on formatted text
					const unique = Array.from(
						new Map(
							suggestions.map((item) => [item.formattedText, item]),
						).values(),
					);
					setData(unique);
				}
			} catch (err) {
				if (isMounted) {
					setError(err instanceof Error ? err : new Error("Unknown error"));
					setData([]);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		fetchLocations();

		return () => {
			isMounted = false;
		};
	}, [query, lat, lon]);

	return { data, isLoading, error, setQueryData: setData };
}
