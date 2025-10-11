"use client";

import { useEffect, useState } from "react";

export default function AccessCounter() {
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState();
    useEffect(() => {
        // APIにfetchする
        fetch("https://script.google.com/macros/s/AKfycbwN8jhwenPf4Kt3kM4iIhc0BBUU8MZv6JfbaEqcyoUIjerv9Tw8jkba-wvnU7QN_31ExQ/exec")
            .then((res) => res.json())
            .then((data) => {
                setCounter(data.counter);
                setLoading(false);
            });
    }, []);
    return (
        <div>
            <p>あなたは {loading ? "Loading..." : counter} 人目の訪問者です。</p>
        </div>
    );
}
