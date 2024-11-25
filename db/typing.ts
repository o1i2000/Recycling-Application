interface Item {
    id: number | null;
    name: string;
    category: string;
    location: string;
    description: string;
    useBy: string;
    quantity: string;
}

type Table = "FoodDonation"