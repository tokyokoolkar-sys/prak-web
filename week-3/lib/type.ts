export type category = "Energy" | "Environment" | "Campus";

export interface Item {
    id: number;
    title: string;
    category: category;
    image?: string;
    description: string;
    availability: boolean;
}