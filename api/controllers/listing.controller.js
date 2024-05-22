import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

//create
export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
      } catch (error) {
        next(error);
      }
};

//delete listing ->id
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

//update listing ->id
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

//get listing->id
export const getListing = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
      }
      res.status(200).json(listing);
    } catch (error) {
      next(error);
    }
  };
  