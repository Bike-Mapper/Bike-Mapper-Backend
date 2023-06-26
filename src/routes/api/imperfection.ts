import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Request from "../../types/Request";
import User, { IUser } from "../../models/User";
import { TImperfection } from "../../models/Imperfection";
import Imperfection from "../../models/Imperfection";
import { IImperfection } from "../../models/Imperfection";

const router: Router = Router();

// @route   POST api/profile
// @desc    Create or update user's profile
// @access  Private
router.post(
  "/",
  [
    auth,
    check("lat", "Latitude is required").not().isEmpty(),
    check("long", "Longitude is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { lat, long } = req.body;

    // Build profile object based on TProfile
    const imperfectionFields: TImperfection = {
      userId: req.userId,
      coords: [lat, long]
    };

    try {
      let user: IUser = await User.findOne({ _id: req.userId });


      if (!user) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "User not registered",
            },
          ],
        });
      }

      // let profile: IProfile = await Profile.findOne({ user: req.userId });
      // if (profile) {
      //   // Update
      //   profile = await Profile.findOneAndUpdate(
      //     { user: req.userId },
      //     { $set: profileFields },
      //     { new: true }
      //   );

      //   return res.json(profile);
      // }

      // Create
      let imperfection = new Imperfection(imperfectionFields);

      await imperfection.save();

      res.json(imperfection);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (_req: Request, res: Response) => {
  try {
    const imperfections: Array<Array<Number>> = (await Imperfection.find()).map((imp: TImperfection) => {
      return imp.coords;
    });

    res.json(imperfections);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});


export default router;
