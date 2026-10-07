export const NOW = "2026-07-21T00:00:00+08:00";
export const PASS = "Password123!";
export const trains = [
    {
        "number": "G1001",
        "from_station": "Shanghai Hongqiao",
        "to_station": "Beijing South",
        "departure": "08:00",
        "arrival": "13:00",
        "duration": 300,
        "second_price": 576
    },
    {
        "number": "G1002",
        "from_station": "Shanghai",
        "to_station": "Beijing",
        "departure": "13:00",
        "arrival": "19:00",
        "duration": 360,
        "second_price": 600
    },
    {
        "number": "K1003",
        "from_station": "Shanghai",
        "to_station": "Beijing South",
        "departure": "00:30",
        "arrival": "15:30",
        "duration": 900,
        "second_price": 200
    }
] as const;
export const plans = [
    {
        "first": "D2001",
        "second": "Z21",
        "departure": "08:00",
        "arrival": "19:00",
        "wait": 60,
        "total": 2100,
        "via": "Beijing",
        "first_price": 200,
        "second_price": 400
    },
    {
        "first": "D2002",
        "second": "Z22",
        "departure": "06:00",
        "arrival": "16:00",
        "wait": 120,
        "total": 2040,
        "via": "Xian",
        "first_price": 180,
        "second_price": 420
    }
] as const;
