import UserLayout from "@/layout/UserLayout";
import style from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

export default function Login() {
  const [userLoggedInMethod, setUserLoggedInMethod] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassord] = useState("");

  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispath = useDispatch();

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  });

  useEffect(() => {
    dispath(emptyMessage());
  }, [userLoggedInMethod]);

  const handleRegister = () => {
    dispath(registerUser({ userName, password, email, name }));
  };

  const handleLogin = () => {
    dispath(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={style.container}>
        <div className={style.cardContainer}>
          <div className={style.cardContainer_left}>
            <p className={style.cardleft_Heading}>
              {userLoggedInMethod ? "Sign In" : "Sing Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message.message}
            </p>

            <div className={style.inputContainer}>
              {!userLoggedInMethod && (
                <div className={style.inputRow}>
                  <input
                    className={style.inputField}
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <input
                    className={style.inputField}
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <input
                className={style.inputField}
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className={style.inputField}
                type="text"
                placeholder="Password"
                onChange={(e) => setPassord(e.target.value)}
              />
              <div
                className={style.buttonWithOutline}
                onClick={() => {
                  if (userLoggedInMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}>
                <p>{userLoggedInMethod ? "Sign In" : "Sing Up"} </p>
              </div>
            </div>
          </div>
          <div className={style.cardContainer_right}>
            <div>
              {userLoggedInMethod ? (
                <p>Don't have an Account??</p>
              ) : (
                <p>Already have an Account??</p>
              )}

              <div
                className={style.buttonWithOutline}
                onClick={() => {
                  setUserLoggedInMethod(!userLoggedInMethod);
                }}
                style={{
                  color: "black",
                  textAlign: "center",
                  margin: "1rem 0",
                }}>
                <p>{userLoggedInMethod ? "Sing Up" : "Sign In"} </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
