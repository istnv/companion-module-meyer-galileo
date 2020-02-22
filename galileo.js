var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);
	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.config = config;
};

instance.prototype.init = function() {
	var self = this;
	self.status(self.STATE_OK); // status ok!
	debug = self.debug;
	log = self.log;
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			tooltip: 'The IP of the Galileo',
			width: 6,
			regex: self.REGEX_IP
		}
	];
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;
	debug("destory", self.id);
};

instance.prototype.actions = function(system) {
	var self = this;
	self.system.emit('instance_actions', self.id, {
		'recall':	{
			label: 'Recall snapshot',
			options: [
				{
					type: 'textinput',
					label: 'Snapshot',
					id: 'snap',
					default: 0,
					regex:   self.REGEX_NUMBER
				}
			]
		},
	});
};

instance.prototype.action = function(action) {
	var self = this;
	var opt = action.options;
	var cmd;
	var arg;

	switch (action.action) {
		case 'recall':
			cmd = "/Recall";
			arg = {
				type: "i",
				value: parseInt(opt.snap)
			};
	}

	if (cmd !== undefined) {
		debug('sending', cmd, "to", self.config.host);
		self.system.emit('osc_send', self.config.host, 15006, cmd, arg);
	}


};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
