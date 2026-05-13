import React, { useEffect } from "react";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/dashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/config/redux/action/authAction";
import style from "./index.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

function DiscoverPage() {
  const authState = useSelector((state) => state.auth);
  const dispath = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispath(getAllUsers());
    }
  }, []);
  return (
    <UserLayout>
      <DashboardLayout>
        <h2>Discover </h2>
        <div className={style.AllUsersProfile}>
          {authState.all_users.map((user, index) => {
            return (
              <div
                onClick={() => {
                  router.push(`/view_profile/${user.userId.userName}`);
                }}
                key={user._id}
                className={style.userCard}>
                <img
                  className={style.userCard_Image}
                  src={`${BASE_URL}/${user.userId.profilePicture}`}
                  alt="User's Profile Image"
                />
                <div className="">
                  <h3>{user.userId.name}</h3>
                  <p>{user.userId.userName}</p>
                </div>
              </div>
            );
          })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default DiscoverPage;
