const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult} = require('express-validator')

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route	Get api/profile/me
// @desc	Get current users profile
// @access	Private
router.get('/me', auth, async(req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

		if(!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' });
		}

		res.json(profile);
	} catch(err){
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route	Post api/profile
// @desc	Create or update users profile
// @access	Private
router.post('/', [ auth, [
	check('status', 'Status is required')
		.not()
		.isEmpty(),
	check('skills', 'Skills is required')
		.not()
		.isEmpty()
] ], async(req, res) =>{
	const errors = validationResult(req)
	if(!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const {
		company,
		website,
		location,
		bio,
		status,
		githubusername,
		skills,
		youtube,
		facebook,
		x,
		instagram,
		linkedin
	} = req.body;

	// Build profile object
	const profileFields = {};
	profileFields.user = req.user.id;
	if(company) profileFields.company = company;
	if(website) profileFields.website = website;
	if(location) profileFields.location = location;
	if(bio) profileFields.bio= bio;
	if(status) profileFields.status = status;
	if(githubusername) profileFields.githubusername = githubusername;
	if (skills) {
		profileFields.skills = skills.split(',').map(skill => skill.trim());
	}

	//Build social object
	profileFields.social = {}
	if(youtube) profileFields.social.youtube = youtube;
	if(x) profileFields.social.x = x;
	if(facebook) profileFields.social.facebook = facebook;
	if(linkedin) profileFields.social.linkedin = linkedin;
	if(instagram) profileFields.social.instagram = instagram;




	try {
		let profile = await Profile.findOne({ user: req.user.id});

		if(profile) {
			// Update
			profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true }
			);

			return res.json(profile);
		}

		// Create
		profile = new Profile(profileFields);

		await profile.save();
		res.json(profile);
	} catch(err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route	Get api/profile
// @desc	Get all profiles
// @access	public
router.get('/', async(req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route	Get api/profile/user/:user_id
// @desc	Get profile by user ID
// @access	public
router.get('/user/:user_id', async(req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

		if(!profile) return res.status(400).json({ msg: 'Profile not found!'});

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		if(err.kind == 'ObjectId'){
			return res.status(400).json({ msg: 'Profile not found!'});
		}
		res.status(500).send('Server Error');
	}
});

// @route	DELETE api/profile
// @desc	DELETE profile, user, post
// @access	private
router.delete('/', auth, async(req, res) => {
	try {
		//@todo remove users posts

		// Remove profile
		await Profile.findOneAndRemove({ user: req.user.id});
		// Remove user
		await User.findOneAndRemove({ _id: req.user.id});

		res.json({msg: 'user deleted'});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route	PUT api/profile/experience
// @desc	adding profile experience
// @access	private
router.put('/experience', 
[
	auth,
	[
		check('title', 'Title is required')
		.not()
		.isEmpty(),
		check('company', 'Company is required')
		.not()
		.isEmpty(),
		check('from', 'From is required')
		.not()
		.isEmpty()
	]
], async(req, res) =>{
	const errors = validationResult( req);
	if(!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const {
		title,
		company,
		location,
		from,
		to,
		current,
		description
	}= req.body;

	const newExp = {
		title,
		company,
		location,
		from,
		to,
		current,
		description
	}

	try {
		const profile = await Profile.findOne({ user: req.user.id});

		profile.experience.unshift(newExp);

		await profile.save();

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route	DELETE api/profile/experience/:exp_id
// @desc	delete experience from profile
// @access	private
router.delete('/experience/:exp_id', auth, async(req, res) =>{
	try {
		const profile = await Profile.findOne({ user: req.user.id});

		// Get remove index
		const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

		profile.experience.splice(removeIndex, 1);

		await profile.save();

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
})

// @route	UPDATE api/profile/experience/:exp_id
// @desc	update experience from profile
// @access	private
// router.put('/experience/:exp_id', [
// 	auth,
// 	[
// 		check('title', 'Title is required')
// 		.not()
// 		.isEmpty(),
// 		check('company', 'Company is required')
// 		.not()
// 		.isEmpty(),
// 		check('from', 'From is required')
// 		.not()
// 		.isEmpty()
// 	]
// ], async(req, res) =>{
// 	const errors = validationResult( req);
// 	if(!errors.isEmpty()) {
// 		return res.status(400).json({ errors: errors.array() });
// 	}
// 	const {
// 		title,
// 		company,
// 		location,
// 		from,
// 		to,
// 		current,
// 		description
// 	}= req.body;

// 	const updateExp = {
// 		title,
// 		company,
// 		location,
// 		from,
// 		to,
// 		current,
// 		description
// 	}
// 	try {
// 		const profile = await Profile.findOne({ user: req.user.id});

		//finding the index of the experience to be updated
		// const updateIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

		// checking if experience is found
		// if(updateExp === -1){
		// 	return res.status(404).json({msg: 'Experience not found!' });
		// }

		// update user experience 
// 		profile.experience[updateIndex ] == updateExp;

// 		await profile.save();

// 		res.json(profile);
// 	} catch (err) {
// 		console.error(err.message);
// 		res.status(500).send('Server Error');
// 	}
// })



module.exports = router;