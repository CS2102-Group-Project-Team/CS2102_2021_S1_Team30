const sql = {}

sql.query = {
	
	insert_bid: 'SELECT insert_bid($1, $2, $3, $4, $5, $6, $7, $8)',

	choose_bids: 'SELECT choose_bids()',

	rate_or_review: 'SELECT rate_or_review($1, $2, $3, $4, $5, $6, $7)',

	set_transac_details: 'SELECT set_transac_details($1, $2, $3, $4, $5, $6, $7)',

	pay_bid: 'SELECT pay_bid($1, $2, $3, $4, $5)',

	search_reviews: 'SELECT review FROM Bids WHERE username = $1 AND review IS NOT NULL',

	search_avg_rating: 'SELECT AVG(rating) FROM Bids WHERE username = $1',

	search_past_orders: 'SELECT pet_name, p_start_date, p_end_date, username, rating, review, payment_method, mode_of_transfer, is_paid, total_price FROM Bids WHERE owner_username = $1 AND is_successful = true',

	search_petdays: 'SELECT SUM(duration) FROM (SELECT p_end_date - p_start_date + 1 AS duration FROM Bids WHERE username = $1 AND p_start_date >= $2 AND p_start_date <= $3 AND is_successful = true)',

	add_owner: "CALL add_owner ($1, $3, $4, $2, $5, $6, $7, $8, $9);",
	add_pet : "CALL add_pet ($1, $2, $3, $4, $5, $6, $7);", 

	get_user : "SELECT * FROM Users WHERE username = $1;",
	get_pet : "SELECT * FROM ownsPets WHERE username = $1 AND name = $2", 

	list_pets : "SELECT * FROM ownsPets WHERE username = $1;", 
	list_cats  : "SELECT * FROM Categories;", 

	//edit information
	update_pass: "UPDATE Owners SET password = $2 WHERE username = $1;",
	update_info: "UPDATE Owners SET email = $2 WHERE username = $1;",
	update_pet : "UPDATE ownsPets SET cat_name = $3, size = $4, description = $5, sociability = $6, special_req = $7 WHERE username = $1 AND name = $2;", 

	//delete information
	del_owner : "DELETE FROM Owners WHERE username = $1;", 
	del_caretaker: "DELETE FROM Caretakers WHERE username = $1", 
	del_pet : "DELETE FROM ownsPets WHERE username = $1 AND name = $2;",

module.exports = sql
