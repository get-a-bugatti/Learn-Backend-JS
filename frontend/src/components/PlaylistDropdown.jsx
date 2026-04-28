import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MdPlaylistAdd } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { useForm } from "react-hook-form";

export default function PlaylistDropdown({ videoId, playlists }) {
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const dropdownRef = useRef();

  // ✅ react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  // 🖱️ Outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPlaylistOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePlaylistButtonClick = (e) => {
    e.stopPropagation();
    setPlaylistOpen(prev => !prev);
  };

  const handleModalOpen = (e) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await axios.post(`/api/v1/playlists/${playlistId}/videos`, { videoId });
      alert("Video added successfully!");
      setPlaylistOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add video.");
    }
  };

  // ✅ Form submit (react-hook-form)
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/v1/playlists/", {
        name: data.name,
        description: data.description,
      });

      console.log("response from creating playlist :", res);
      reset(); // clear form
      setModalOpen(false);
      setPlaylistOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create playlist.");
    }
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 🎵 Button */}
      <button
        id={`add-playlist-btn-${videoId}`}
        className="px-2 py-1 rounded text-sm cursor-pointer"
        onClick={handlePlaylistButtonClick}
      >
        <MdPlaylistAdd size={24} />
      </button>

      {/* Tooltip */}
      <Tooltip
        anchorSelect={`#add-playlist-btn-${videoId}`}
        place="top"
        content="Add video to your playlist"
        delayShow={200}
      />

      {/* 📂 Dropdown */}
      {playlistOpen && (
        <div
          className="absolute z-50 mt-1 bg-white border shadow-lg rounded w-48"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="px-2 py-1 cursor-pointer hover:bg-gray-100"
            onClick={handleModalOpen}
          >
            + Create New Playlist
          </div>

          {playlists.map(pl => (
            <div
              key={pl._id}
              className="px-2 py-1 cursor-pointer hover:bg-gray-100"
              onClick={() => handleAddToPlaylist(pl._id)}
            >
              {pl.name}
            </div>
          ))}
        </div>
      )}

      {/* 🧾 Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(false);
          }}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              Create New Playlist
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>

              {/* 🎵 Name */}
              <input
                type="text"
                placeholder="Playlist Name"
                className="w-full border border-gray-300 px-3 py-2 mb-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("name", {
                  required: "Playlist name is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters required"
                  }
                })}
              />

              {/* ❌ Name error */}
              {errors.name && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.name.message}
                </p>
              )}

              {/* 📝 Description */}
              <textarea
                placeholder="Description (optional)"
                rows={3}
                className="w-full border border-gray-300 px-3 py-2 mb-1 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("description", {
                  maxLength: {
                    value: 150,
                    message: "Max 150 characters allowed"
                  }
                })}
              />

              {/* ❌ Description error */}
              {errors.description && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.description.message}
                </p>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}