
import { VideoCard, SubscribeBtnForm } from "../components";

export default function Channel({
  channel={},
}) {
  
  if (!channel) return <div>Channel not found</div>;

  return (
    <div className="w-full">

      {/* 🔥 Channel Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <img
          src={channel.avatar}
          alt="avatar"
          className="w-20 h-20 rounded-full object-contain bg-white"
        />

        <div>
          <h1 className="text-xl font-bold">{channel.fullName}</h1>
          <p className="text-gray-500">@{channel.username}</p>
          <p className="text-gray-500">
            {channel.subscribersCount} subscribers
          </p>
        </div>

        {/* 🔥 Subscribe button */}
        <SubscribeBtnForm channel={channel}/>
      </div>

      {/* 🔥 Videos Section */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {channel.videos.map(video => (
          <VideoCard
            key={video._id}
            _id={video._id}
            title={video.title}
            avatar={channel.avatar}
            owner={video.owner}
            duration={video.duration}
            views={video.views}
            thumbnail={video.thumbnail}
            playlistDropdown={false}
          />
        ))}
      </div>
    </div>
  );
}