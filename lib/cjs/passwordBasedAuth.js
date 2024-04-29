const bcrypt = require("bcrypt")

/**
 * 
 * @param {Object} originalData 
 * @param {{id: string, ...}} comparisonData 
 * @param {{idFields: Array<string> , pinField: string}} fields 
 * @returns 
 */
const check = async (originalData, comparisonData, { idFields = ['username'], pinField = 'password' }) => {
	if (
		!idFields.some((id) => originalData[id] === comparisonData.id)
		||
		!bcrypt.compareSync(comparisonData[pinField], originalData[pinField])
	) {
		return false
	}
	
	return true
}

/**
 * 
 * @param {String} pin 
 * @param {Number} saltRounds
 * @returns
 */
const hashPin = async (pin, saltRounds = 10) => {
	return bcrypt.hashSync(pin, saltRounds);
}

module.exports = {
	check,
	hashPin
}