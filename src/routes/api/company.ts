import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Profile, { TProfile, IProfile } from "../../models/Profiles";
import Request from "../../types/Request";
import User, { IUser } from "../../models/User";
import Company, { ICompany, TCompany } from "../../models/Company";

const router: Router = Router();

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/", async (req: Request, res: Response) => {
  try {
    const companies: ICompany[] = await (await Company.find()).map((x: ICompany) => x);
    if (!companies) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "There is no company",
          },
        ],
      });
    }

    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});



// @route   POST api/profile
// @desc    Create or update user's profile
// @access  Private
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("price", "Price is required").not().isEmpty(),
    check("imagePath", "Image Path is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { name, description, price, imagePath } = req.body;

    // Build profile object based on TProfile
    const companyFields: TCompany = {
      name: name,
      description: description,
      price: price,
      image_path: imagePath
    };

    try {


      let company = new Company(companyFields);

      await company.save();

      res.json(company);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

export default router;
