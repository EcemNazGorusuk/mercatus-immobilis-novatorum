// import Listing from "../models/listing.model.js";
// import User from "../models/user.model.js";
// import { errorHandler } from "../utils/error.js";

// export const createListing = async (req, res, next) => {
//     try {
//         const listing = await Listing.create(req.body);
//         return res.status(201).json(listing);
//       } catch (error) {
//         next(error);
//       }
// };
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    // Gelen isteği al
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
      userRef
    } = req.body;

    // Yeni bir Listing oluştur
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
      userRef
    });

    // Listing'i veritabanına kaydet
    const savedListing = await newListing.save();

    // Mevcut listeleri getir
    const existingListings = await Listing.find();

    // Listing'i oluşturan kullanıcıyı güncelle (isteğe bağlı)
    // Örneğin, kullanıcı referansı üzerinden kullanıcıyı bulup burada güncelleme yapabilirsiniz.

    // Yanıtı döndür, yeni liste ve mevcut listeler
    res.status(201).json({ newListing: savedListing, existingListings });
  } catch (error) {
    // Hata durumunda hatayı işleme aktar
    next(error);
  }
};
