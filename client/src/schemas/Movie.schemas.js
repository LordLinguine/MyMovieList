import * as Yup from "yup";

export const QuerySchema = Yup.object().shape({
  query: Yup.string()
    .trim()
    .min(2, "Your search is too short.")
    .max(100, "Your search exceeds the max characters.")
    .required("Must enter a search value."),
});

export const RatingSchema = Yup.object().shape({
  rating: Yup.number()
    .min(0, "The min rating is zero.")
    .max(10, "The max rating is 10.")
    .required("Must enter a rating value."),
});
