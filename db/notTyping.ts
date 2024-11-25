interface User {
    id: number;
    username: string;
    totalScore: number;
    score: number;
    selected: boolean;
    dateAdded: string;
    scoresAddedToday: number;
}

type Table2 = "Scores"