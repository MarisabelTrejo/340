const pool = require("../database/")
 
/* ***************************
*  Get all classification data
* ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}
 
/* ***************************
*  Get all inventory items and classification_name by classification_id
* ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}
 
 
async function buildByInvId(inv_id) {
  try {
    // Ensure inv_id is a valid integer
    const invIdNum = parseInt(inv_id);
    if (isNaN(invIdNum)) {
      throw new Error(`Invalid inventory ID: ${inv_id}`);
    }

    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_id = $1",
      [invIdNum]
    );

    return data.rows;
  } catch (error) {
    console.error("Error in buildByInvId:", error);
    return []; // Return an empty array to prevent further crashes
  }
}

async function getInventoryById(invId) {
  try {
  const data = await pool.query(
  "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_id = $1",
  [invId]
  )
  return data.rows[0]
  } catch (error) {
  console.error(error)
  }
}
 
/* ***************************
*  Update Inventory Data
* ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}
 
async function addReview(review_text, review_screen_name, inv_id) {
  try {
    console.log(review_text, review_screen_name, inv_id)
    const sql = "INSERT INTO review (review_text, review_screen_name, inv_id) VALUES ($1, $2, $3) RETURNING *"
    return await pool.query(sql, [review_text, review_screen_name, inv_id])
  } catch (error) {
    return error.message
  }
}
 
async function deleteInventoryItem(inv_id) {
  try {
  const sql = "DELETE FROM inventory WHERE inv_id = $1"
  const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
  new Error("Delete Inventory Error")
  }
}
 
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  buildByInvId,
  getInventoryById,
  updateInventory,
  deleteInventoryItem,
  addReview
};
