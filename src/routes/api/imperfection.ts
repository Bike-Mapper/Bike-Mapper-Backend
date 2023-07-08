import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Request from "../../types/Request";
import User, { IUser } from "../../models/User";
import { TImperfection } from "../../models/Imperfection";
import Imperfection from "../../models/Imperfection";
import { IImperfection } from "../../models/Imperfection";
import { IProfile } from "../../models/Profiles";
import Profile from "../../models/Profiles";

const router: Router = Router();

const SCORE_PER_REPORT = 5;
const MIN_DISTANCE = 10.0;

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

      for (let imperfection of await Imperfection.find({ userId: req.userId })) {
        let lat2 = imperfection.coords[0] as number;
        let long2 = imperfection.coords[1] as number;
        
        if(distance(lat, long, lat2, long2) < MIN_DISTANCE ) {
          return res.json(imperfection);
        }
      }

      let profile: IProfile = await Profile.findOne({ user: req.userId });
      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.userId },
          { score: profile.score + SCORE_PER_REPORT},
          {  }
        );

      } else {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "User without Profile",
            },
          ],
        });

      }

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


function distance(lat1: number, lon1: number, lat2: number, lon2: number) : number{ 
  let R = 6378.137; 
  let dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  let dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  let d = R * c;
  return d * 1000;
}

export default router;
