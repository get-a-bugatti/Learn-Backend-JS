

const formatSubscribers = (subscribers) => {
    if (typeof subscribers !== "Number") {
        subscribers = Number(subscribers);
    }

    if (subscribers < 1000) return `${subscribers} subscriber${subscribers === 1 ? "" : "s"}`;

    if (subscribers < 1_000_000) {
        const val = (subscribers / 1000).toFixed(1).replace(/\.0$/, "");
        return `${val}K subscribers`;
    }

    if (subscribers < 1_000_000_000) {
        const val = (subscribers / 1_000_000).toFixed(1).replace(/\.0$/, "");
        return `${val}M subscribers`;
    }

    const val = (subscribers / 1_000_000_000).toFixed(1).replace(/\.0$/, "");
    return `${val}B subscribers`;
};


export default function SubscriptionCard({
    channel,
}) {
    return (
        <div className="ml-50 max-w-2xl rounded-lg flex flex-row bg-white cursor-pointer py-2 px-2 gap-4 items-center">
            <img src={channel.avatar} alt="pfp image" className="w-22 h-22 rounded-full object-cover" />
            <div className="userinfo-container flex flex-col">
                <p className="fullName font-bold text-xl">{channel.fullName}</p>
                <p className="username text-sm text-gray-500">@{channel.username}</p>
                <p className="subscribers text-sm text-gray-500">{formatSubscribers(channel.subscribersCount)}</p>
            </div>
            {
                // later add subscribe button
            }
        </div>
    )
}