/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Address management endpoints
 */

/**
 * @swagger
 * /alladdress:
 *   get:
 *     summary: Get all addresses
 *     tags: [Addresses]
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /newaddress:
 *   post:
 *     summary: Add a new address
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressName
 *               - address
 *               - lat
 *               - lng
 *             properties:
 *               addressName:
 *                 type: string
 *               address:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *     responses:
 *       201:
 *         description: Address added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /editaddress:
 *   put:
 *     summary: Edit an existing address
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - addressName
 *               - address
 *               - lat
 *               - lng
 *             properties:
 *               id:
 *                 type: string
 *               addressName:
 *                 type: string
 *               address:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Validation error / No fields to update
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /deleteaddress/{addressId}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       400:
 *         description: Invalid address ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Internal server error
 */

import express from "express";
import { 
  newaddress, 
  alladdress, 
  deleteAddress, 
  editaddress 
} from "../controllers/addressController";


const router = express.Router();

router.get("/alladdress", alladdress);
router.post("/newaddress", newaddress);
router.put("/editaddress", editaddress);
router.delete("/deleteaddress/:addressId", deleteAddress);

export default router;
