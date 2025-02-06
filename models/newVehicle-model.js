const pool = require("../database/")
 
/* *****************************
*   insert new vehicle into inventory
* *************************** */
async function newvehicle(make, model, description, image_path, thumbnail_path, price, year, miles, color, classification_id){
    try {
      const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
      return await pool.query(sql, [make, model, description, image_path, thumbnail_path, price, year, miles, color, classification_id])
    } catch (error) {
      return error.message
    }
  }
 
module.exports = {newvehicle}