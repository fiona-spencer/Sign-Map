import { Button, Alert } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { app } from "../firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function OAuth({ userType }) {
  const [error, setError] = useState(null);
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    // Only check for userType in signup, not signin
    if (userType === "") {
      setError("Please choose a user type.");
      return;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
          userType, // sending this to backend only during signup
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      } else {
        setError(data.message || "Something went wrong during sign-in.");
      }
    } catch (error) {
      console.log("OAuth error:", error);
      setError("Something went wrong with Google sign-in.");
    }
  };

  return (
    <div className="">
      {error && <Alert color="failure">{error}</Alert>}
      <Button type="button" color="dark" className="w-full" outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle className="w-6 h-6 mr-2" />
        Continue with Google
      </Button>
    </div>
  );
}
