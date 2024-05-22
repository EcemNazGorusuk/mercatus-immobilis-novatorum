import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

//create
export const createListing = async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userRef,
    } = req.body;

    const newListing = new Listing({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userRef,
    });

    const savedListing = await newListing.save();

    // get existed lists
    const existingListings = await Listing.find();

    res.status(201).json({ newListing: savedListing, existingListings });
  } catch (error) {
    next(error);
  }
};

//delete
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findByIdAndDelete(req.params.id); //determine listing exists or not
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    //if req.user.id   ----> jwt verify in verifyUser.js does not match userRef(holds current user id)
    return next(errorHandler(401, "You can only delete your own listings!"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id); //router.delete('/delete/:id',verifyToken,deleteListing)
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

//update
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    //if req.user.id   ----> jwt verify in verifyUser.js does not match userRef(holds current user id)
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      // Update with existing listing values and the newly changed properties

      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
