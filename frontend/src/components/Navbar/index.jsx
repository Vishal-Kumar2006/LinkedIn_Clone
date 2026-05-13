import React from "react";
import style from "./Styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

const NavbarComponents = () => {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispath = useDispatch();
  return (
    <div className={style.navbar}>
      <h2
        onClick={() => {
          router.push("/");
        }}>
        Pro Connect
      </h2>
      <div className={style.navbar_optionalContainer}>
        {authState.profileFetched && (
          <div>
            <div style={{ display: "flex", gap: "1.2rem" }}>
              <p
                onClick={() => router.push("/profile")}
                style={{ color: "green", fontWeight: "bold" }}>
                Profile
              </p>
              <p
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                  dispath(reset());
                }}
                style={{ color: "red", fontWeight: "bold" }}>
                Logout
              </p>
            </div>
          </div>
        )}
        {!authState.profileFetched && (
          <div
            className={style.buttonJoin}
            onClick={() => {
              router.push("/login");
            }}>
            <p>Ba a part</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarComponents;
