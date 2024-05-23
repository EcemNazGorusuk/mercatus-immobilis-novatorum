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
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

//get all listings
export const getListings = async (req, res, next) => {
  //here we set search,sort,order,pagination filter
  try {
    const limit = parseInt(req.query.limit) || 9; //limit sets how much listing shows in per page
    const startIndex = parseInt(req.query.startIndex) || 0; //start index sets pagination index
    let offer = req.query.offer; //offer filters offer

    if (offer === undefined || offer === "false") {
      //if offer is undefined or false(means not selected), we set offer both true and false are retrieved and filtered.
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished; //furnished filters furnished

    if (furnished === undefined || furnished === "false") {
      //if furnished is undefined or false(means not selected), we set furnished both true and false are retrieved and filtered.
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking; //parking filters parking

    if (parking === undefined || parking === "false") {
      //if parking is undefined or false(means not selected), we set parking both true and false are retrieved and filtered.
      parking = { $in: [false, true] };
    }

    let type = req.query.type; //type filters type

    if (type === undefined || type === "all") {
      //if type is undefined or all(means not selected & selected), we set type both sale and rent are retrieved and filtered.
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || ""; //searchTerm is used for searching, default empty

    const sort = req.query.sort || "createdAt"; //sort is used for sorting, default created at used

    const order = req.query.order || "desc"; //order is used for ordering, default descending order

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    // regex is used to search in the name field, and the i option removes case sensitivity.
    // The previously set filters for offer, furnished, parking, and type are used here.
    // Results are sorted according to the specified sort field and order direction.
    // Results are limited by the limit and skipped by the startIndex (pagination).
    
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
