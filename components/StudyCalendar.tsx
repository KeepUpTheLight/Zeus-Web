"use client";

import { Post } from "@/types/post";
import { useState } from "react";

interface StudyCalendarProps {
    posts: Post[];
}

export default function StudyCalendar({ posts }: StudyCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Helper to get days in month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Helper to get day of week for first day (0 = Sunday)
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Filter posts for this month
    const getPostsForDay = (day: number) => {
        return posts.filter((post) => {
            const postDate = new Date(post.created_at);
            return (
                postDate.getFullYear() === year &&
                postDate.getMonth() === month &&
                postDate.getDate() === day
            );
        });
    };

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(year, month + offset, 1));
    };

    // Generate calendar grid
    const renderCalendar = () => {
        const blanks = Array(firstDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const totalSlots = [...blanks, ...days];

        return (
            <div className="grid grid-cols-7 gap-1 text-center">
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                    <div key={day} className="text-sm font-medium text-slate-500 py-2">
                        {day}
                    </div>
                ))}
                {totalSlots.map((day, index) => {
                    if (!day) return <div key={`blank-${index}`} className="h-14"></div>;

                    const dayPosts = getPostsForDay(day);
                    const hasStudyLog = dayPosts.length > 0;
                    const isToday =
                        new Date().toDateString() === new Date(year, month, day).toDateString();

                    return (
                        <div
                            key={day}
                            className={`h-14 flex flex-col items-center justify-center rounded-lg relative ${isToday ? "bg-slate-800 border border-slate-700" : ""
                                }`}
                        >
                            <span
                                className={`text-sm ${isToday ? "font-bold text-blue-400" : "text-slate-300"
                                    }`}
                            >
                                {day}
                            </span>
                            {hasStudyLog && (
                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-100">
                    {year}년 {month + 1}월
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="p-1 rounded-md hover:bg-slate-800 text-slate-400"
                    >
                        ←
                    </button>
                    <button
                        onClick={() => changeMonth(1)}
                        className="p-1 rounded-md hover:bg-slate-800 text-slate-400"
                    >
                        →
                    </button>
                </div>
            </div>
            {renderCalendar()}
        </div>
    );
}
