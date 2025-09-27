import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchSpaceMembers, inviteMemberToSpace, removeMemberFromSpace } from "~/api/spaceApi";
import {fetchProjectMembers, inviteMemberToProject, removeMemberFromProject} from "~/api/projectMemberApi";
import { useNotifications } from "~/contexts/NotificationContext";

function Members({ type }) {
  const params = useParams();
  const entityId = type === "space" ? params.spaceId : params.projectId;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const { refreshNotifications, refreshNotificationsWithSocket } = useNotifications();

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const membersData = type === "space"
            ? await fetchSpaceMembers(entityId) // ✅ Lấy thành viên Space
            : await fetchProjectMembers(entityId); // ✅ Lấy thành viên Project

        // Đảm bảo membersData là array
        setMembers(Array.isArray(membersData) ? membersData : []);
      } catch (error) {
        console.error(error.message);
        setMembers([]); // Set empty array nếu có lỗi
      }
    };

    if (entityId) {
      loadMembers();
    }
  }, [entityId, type]);

  const handleInviteMember = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!email.trim()) {
      setMessage("Please enter an email.");
      setLoading(false);
      return;
    }

    try {
      // Gọi API backend, gửi email trực tiếp
      await (type === "space"
          ? inviteMemberToSpace(entityId, email)
          : inviteMemberToProject(entityId, email));

      setMessage("Member added successfully!");
      setEmail("");
      setOpen(false);

      // Reload danh sách members để đảm bảo có đầy đủ thông tin user
      const membersData = type === "space"
          ? await fetchSpaceMembers(entityId)
          : await fetchProjectMembers(entityId);

      setMembers(Array.isArray(membersData) ? membersData : []);

      // Refresh notifications để hiển thị thông báo mới ngay lập tức
      console.log('🔄 Refreshing notifications after member addition...');
      refreshNotificationsWithSocket();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle remove member
  const handleRemoveMember = async (member) => {
    if (!window.confirm(`Are you sure you want to remove ${member.user.fullName || member.user.email} from this ${type}?`)) {
      return;
    }

    try {
      const memberId = member._id;

      if (type === "space") {
        await removeMemberFromSpace(memberId);
      } else {
        await removeMemberFromProject(memberId);
      }

      // Refresh members list
      const membersData = type === "space"
        ? await fetchSpaceMembers(entityId)
        : await fetchProjectMembers(entityId);

      setMembers(Array.isArray(membersData) ? membersData : []);
      setMessage(`Member removed successfully from ${type}`);

      // Refresh notifications after member removal
      console.log('🔄 Refreshing notifications after member removal...');
      refreshNotificationsWithSocket();
    } catch (error) {
      setMessage(error.message);
    }
  };


  return (
      <div className="w-full min-h-screen">
        <div className="w-full h-full">
          <div className="p-4 flex">
            <div className="flex items-center w-full justify-between mb-6">
              <div>
                <div className="font-bold text-xl">Members</div>
                <p className="text-sm text-muted-foreground">
                  {type === "space"
                      ? "Members can be added by space owners"
                      : "Members can be added by project owners"}
                </p>
              </div>

              <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                  <button className="inline-flex items-center bg-primary text-primary-foreground justify-center rounded-md text-sm px-4 py-2">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                          d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                      ></path>
                    </svg>
                    Invite
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="dialog-overlay fixed inset-0 bg-black bg-opacity-50" />
                  <Dialog.Content className="w-full max-w-lg dialog-content fixed border border-color rounded-md shadow-lg p-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Dialog.Title className="mb-2 text-lg font-semibold">Invite Member</Dialog.Title>
                    <form className="space-y-4" onSubmit={handleInviteMember}>
                      <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            className="background-primary w-full mt-1 px-3 py-2 border border-color rounded-md focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
                            placeholder="Enter email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                      </div>
                      {message && (
                          <p className={`text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                            {message}
                          </p>
                      )}
                      <div className="flex justify-end space-x-4">
                        <Dialog.Close asChild>
                          <button type="button" className="border border-color bg-white text-primary-foreground px-4 py-2 rounded-md">
                            Cancel
                          </button>
                        </Dialog.Close>
                        <button type="submit" className="border border-color text-white px-4 py-2 rounded-md" disabled={loading}>
                          {loading ? "Inviting..." : "Invite"}
                        </button>
                      </div>
                    </form>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </div>

          <div className="w-full">
            {members.length === 0 ? (
                <p className="text-gray-400">No members yet.</p>
            ) : (
                members.map((member) => {
                  // Kiểm tra an toàn dữ liệu
                  if (!member || !member.user) {
                    return null;
                  }

                  return (
                    <div key={member.user._id || member._id} className="flex items-center gap-3 border-b border-color py-2">
                      <span className="rounded-full bg-gray-500 text-white flex items-center justify-center w-10 h-10">
                        {(member.user.fullName || member.user.email || 'U').charAt(0).toUpperCase()}
                      </span>
                      <div className="flex-1">
                        <p className="text-white">{member.user.fullName || 'Unknown User'}</p>
                        <p className="text-gray-400 text-sm">{member.user.email || 'No email'}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-md bg-yellow-500 text-black">
                        {(member.role || 'member').toUpperCase()}
                      </span>

                      {/* ✅ Dropdown menu với icon ba chấm */}
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="p-2 hover:bg-gray-700 rounded-md transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="19" cy="12" r="1"></circle>
                              <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                          </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Content className="bg-gray-800 border border-gray-700 rounded-md shadow-lg p-1 min-w-[120px]">
                          <DropdownMenu.Item
                            className="flex items-center px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded cursor-pointer"
                            onClick={() => handleRemoveMember(member)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                            Remove
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
  );
}

export default Members;