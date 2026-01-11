"use client";

export default function StatsOverview({ totalPosts }: { totalPosts: number }) {
    // Mock data for now, could be passed as props or calculated
    const stats = [
        { name: "총 공부 기록", value: totalPosts.toString(), label: "개", color: "bg-blue-500" },
        { name: "D-Day", value: "D-45", label: "2026.02.25", color: "bg-amber-500" },
        { name: "연속 학습일", value: "3", label: "일째", color: "bg-emerald-500" },
        { name: "총 학습 시간", value: "124", label: "시간", color: "bg-indigo-500" },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
                <div
                    key={stat.name}
                    className="relative overflow-hidden rounded-xl bg-white p-5 shadow-sm border border-slate-200"
                >
                    <dt>
                        <div className={`absolute rounded-md p-3 opacity-10 ${stat.color} w-full h-full top-0 left-0`}></div>
                        <p className="truncate text-sm font-medium text-slate-500">
                            {stat.name}
                        </p>
                    </dt>
                    <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                        <div className="flex items-baseline text-2xl font-semibold text-slate-900">
                            {stat.value}
                            <span className="ml-2 text-sm font-medium text-slate-500">
                                {stat.label}
                            </span>
                        </div>

                        {/* Decorative icon or visual cue could go here */}
                        {/* <div className={`h-2 w-2 rounded-full ${stat.color.replace('bg-', 'bg-')}`}></div> */}
                    </dd>
                </div>
            ))}
        </div>
    );
}
