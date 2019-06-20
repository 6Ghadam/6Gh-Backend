const utility = rootRequire('./helper/utility');

const createError = require('http-errors');

module.exports = Model => {

  /**
  * @function	Function Fetch a model by provided identifier and throw 
  *                    error if it was not found
  * @param  {String} id The model identifier to fetch
  */
  Model.fetchModel = async id => {
		let model = await Model.findById(id.toString());
		if (!model) {
			throw createError(404);
		}
		return model;
	};

  // Wrapp the function inside the Try/Catch
  Model.fetchModel = 
    utility.wrapper(Model.fetchModel);

  /**
  * @function	Function Fetch a model by provided identifier
  * @param  {String} id The model identifier to fetch
  */
 Model.fetchModelWithNullOption = async id => {
		let model = await Model.findById(id.toString());
		return model;
	};

  // Wrapp the function inside the Try/Catch
  Model.fetchModelWithNullOption =
    utility.wrapper(Model.fetchModelWithNullOption);

  /**
  * @function	Function Fetch models list by provided filter and throw 
  *                    error if there was not found any
  * @param  {String} filter The filter to fetch
  */
 Model.fetchModels = async filter => {
		let models = await Model.find(filter);
		if (models.length === 0) {
			throw createError(404);
		}
		return models;
	};

  // Wrapp the function inside the Try/Catch
  Model.fetchModels = 
    utility.wrapper(Model.fetchModels);

  /**
  * @function	Function Fetch models list by provided filter
  * @param  {String} filter The filter to fetch
  */
 Model.fetchModelsWithNullOption = async filter => {
		let models = await Model.find(filter);
		return models;
	};

  // Wrapp the function inside the Try/Catch
  Model.fetchModelsWithNullOption =
	  utility.wrapper(Model.fetchModelsWithNullOption);

};
