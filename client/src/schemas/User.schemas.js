import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .max(100, "Your email exceeds the max characters.")
    .email("Please enter a valid email.")
    .required("Must enter your email."),
  password: Yup.string()
    .trim()
    .min(8, "Your password must be atleast 8 characters.")
    .max(256, "Your password exceeds the max characters.")
    .required("Must enter your password."),
});

export const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .max(100, "Your email exceeds the max characters (100).")
    .email("Please enter a valid email.")
    .required("Must enter your email."),
  username: Yup.string()
    .trim()
    .min(1, "Please create a username.")
    .max(300, "Your username exceeds the max characters (300).")
    .required("Please create a username."),
  password: Yup.string()
    .trim()
    .min(8, "Your password must be atleast 8 characters.")
    .max(300, "Your password exceeds the max characters (300).")
    .matches(
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      "Must contain atleast 1 upper and lower case letter, 1 number, and 1 special symbol."
    )
    .required("Must create a password."),
  confirmPassword: Yup.string()
    .trim()
    .min(1, "You must confirm your password.")
    .max(300, "Your confirmation password exceeds the max characters (300).")
    .oneOf(
      [Yup.ref("password"), null],
      "You confirmation password does NOT match."
    )
    .required("You must confirm your password."),
});

// Image Requirements
const MAX_FILE_SIZE = 102400 * 10; // 1000kb = 1mb

const validFileExtensions = {
  image: ["jpg", "png", "jpeg"],
};

const isValidFileType = (fileName, fileType) =>
  fileName &&
  validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1;

export const ProfilePictureSchema = Yup.object().shape({
  profilePicture: Yup.mixed()
    .required("Required")
    .test("is-valid-type", "Not a valid image type", (value) =>
      isValidFileType(value && value.name.toLowerCase(), "image")
    )
    .test(
      "is-valid-size",
      "Max allowed size is 100KB",
      (value) => value && value.size <= MAX_FILE_SIZE
    ),
});

export const UsernameSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .min(1, "Please enter a new username.")
    .max(300, "Your new username exceeds the max characters (300).")
    .required("Please enter a new username."),
});

export const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .trim()
    .min(1, "Must enter a password.")
    .max(300, "Your password exceeds the max characters (300).")
    .required("Must enter a password."),
});
