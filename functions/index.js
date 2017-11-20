const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {

    let er = 'byll';

    if (request.body.ert !== undefined) {
        er = request.body.ert;
    }

    if (request.query.qwe !== undefined) {
        er = request.query.qwe;
    }

    response.send(er);
});

exports.getAllData = functions.https.onRequest((request, response) => {

    admin.database().ref().on('value', function (snapshot) {

        response.send(snapshot.val());
    });
});

exports.getMembershipById = functions.https.onRequest((request, response) => {

    let id = request.query.id;

    if (id === undefined) {
        response.status = 400;
        response.send({ error: 'Missing query parameter \'id\' ' });
        return;
    }

    admin.database().ref().child('memberships').orderByKey().equalTo(id).on('value', function (snapshot) {

        let returnArr = [];

        snapshot.forEach(function (child) {
            var value = child.val();
            returnArr.push(child.val());
        });

        response.send(returnArr);

    });
});

exports.getMembershipsForUser = functions.https.onRequest((request, response) => {

    let userId = request.query.userId;

    if (userId === undefined) {
        response.status = 400;
        response.send({ error: 'Missing query parameter \'userId\' ' });
        return;
    }

    admin.database().ref().child('memberships').orderByChild('userId').equalTo(userId).on('value', function (snapshot) {

        let returnArr = [];

        snapshot.forEach(function (child) {
            var value = child.val();
            returnArr.push(child.val());
        });

        response.send(returnArr);

    });
});

exports.getMembershipsForUserAllDataFake = functions.https.onRequest((request, response) => {

    let userId = request.query.userId;

    if (userId === undefined) {
        response.status = 400;
        response.send({ error: 'Missing query parameter \'userId\' ' });
        return;
    }

    response.send({
        USER_ID: userId,
    });
});

exports.getMembershipsForProfileAllData = functions.https.onRequest((request, response) => {
    let profileId = request.query.profileId;

    if (profileId === undefined) {
        response.status = 400;
        response.send({ error: 'Missing query parameter \'profileId\' ' });
        return;
    }

    admin.database().ref().child('users').orderByChild('profileId').equalTo(profileId).on('value', function (snapshot) {

        let returnArr = [];

        snapshot.forEach(function (child) {
            var value = child.val();
            fetchAllData(request, response, value);
        });

    });
});

function fetchAllData(request, response, user) {

    let userId = user.id;

    if (userId === undefined) {
        response.status = 400;
        response.send({ error: 'No value for \'userId\' ' });
        return;
    }


    let memprom = admin.database().ref().child('memberships').orderByChild('userId').equalTo(userId).once('value').then(function (snapshot) {

        let memberships = [];
        let checkpoints = [];
        let gates = [];
        let controllers = [];
        let wifiNetworks = [];

        let fetchCheckpointPromises = [];

        let checkpointIds = [];

        snapshot.forEach(function (child) {
            let value = child.val();
            memberships.push(child.val());

            checkpointIds.push(child.val().checkpointId);

            let a = admin.database().ref().child('checkpoints').orderByKey().equalTo(child.val().checkpointId).once('value').then(function (snapshot1) {

                snapshot1.forEach(function (child1) {
                    var value = child1.val();
                    checkpoints.push(child1.val());

                });

            }, function (error3) {
                // The Promise was rejected.
                response.send(error3);
                console.error(error3);
            });

            fetchCheckpointPromises.push(a);

        });

        Promise.all(fetchCheckpointPromises).then(function (results) {

            let fetchPromises = [];

            for (let checkpoint of checkpoints) {


                let controllerProm = admin.database().ref().child('controllers').orderByKey().equalTo(checkpoint.controllerId).once('value').then(function (snapshot2) {

                    snapshot2.forEach(function (child2) {
                        // var value = child1.val();
                        controllers.push(child2.val());
                    });

                }, function (error3) {
                    // The Promise was rejected.
                    response.send(error3);
                    console.error(error3);
                });

                fetchPromises.push(controllerProm);


                let wifinetworkProm = admin.database().ref().child('wifiNetworks').orderByKey().equalTo(checkpoint.wifiNetworkId).once('value').then(function (snapshot3) {

                    snapshot3.forEach(function (child3) {
                        // var value = child1.val();
                        wifiNetworks.push(child3.val());
                    });

                }, function (error3) {
                    // The Promise was rejected.
                    response.send(error3);
                    console.error(error3);
                });


                fetchPromises.push(wifinetworkProm);

                for (let gateId of checkpoint.gateIds) {

                    let gateProm = admin.database().ref().child('gates').orderByKey().equalTo(gateId).once('value').then(function (snapshot4) {

                        snapshot4.forEach(function (child4) {
                            // var value = child1.val();
                            gates.push(child4.val());
                        });

                    }, function (error4) {
                        // The Promise was rejected.
                        response.send(error4);
                        console.error(error4);
                    });

                    fetchPromises.push(gateProm);
                }
            }


            Promise.all(fetchPromises).then(function (results0) {

                response.send({
                    user: user,
                    memberships: memberships,
                    checkpoints: checkpoints,
                    gates: gates,
                    controllers: controllers,
                    wifiNetworks: wifiNetworks,
                });

            }, function (reason) {
                // rejection
            });


        }, function (reason) {
            // rejection
        });

    }, function (error) {
        // The Promise was rejected.
        response.send(error);
        console.error(error);
    });
}

exports.getMembershipsForUserAllData = functions.https.onRequest((request, response) => {

    let userId = request.query.userId;

    if (userId === undefined) {
        response.status = 400;
        response.send({ error: 'Missing query parameter \'userId\' ' });
        return;
    }


    let memprom = admin.database().ref().child('memberships').orderByChild('userId').equalTo(userId).once('value').then(function (snapshot) {

        let memberships = [];
        let checkpoints = [];
        let controllers = [];
        let wifiNetworks = [];

        let fetchCheckpointPromises = [];

        let checkpointIds = [];

        snapshot.forEach(function (child) {
            let value = child.val();
            memberships.push(child.val());

            checkpointIds.push(child.val().checkpointId);

            let a = admin.database().ref().child('checkpoints').orderByKey().equalTo(child.val().checkpointId).once('value').then(function (snapshot1) {

                snapshot1.forEach(function (child1) {
                    var value = child1.val();
                    checkpoints.push(child1.val());

                });

            }, function (error3) {
                // The Promise was rejected.
                response.send(error3);
                console.error(error3);
            });

            fetchCheckpointPromises.push(a);

        });

        Promise.all(fetchCheckpointPromises).then(function (results) {

            let fetchPromises = [];

            for (let checkpoint of checkpoints) {


                let controllerProm = admin.database().ref().child('controllers').orderByKey().equalTo(checkpoint.controllerId).once('value').then(function (snapshot2) {

                    snapshot2.forEach(function (child2) {
                        // var value = child1.val();
                        controllers.push(child2.val());
                    });

                }, function (error3) {
                    // The Promise was rejected.
                    response.send(error3);
                    console.error(error3);
                });


                let wifinetworkProm = admin.database().ref().child('wifiNetworks').orderByKey().equalTo(checkpoint.wifiNetworkId).once('value').then(function (snapshot3) {

                    snapshot3.forEach(function (child3) {
                        // var value = child1.val();
                        wifiNetworks.push(child3.val());
                    });

                }, function (error3) {
                    // The Promise was rejected.
                    response.send(error3);
                    console.error(error3);
                });


                fetchPromises.push(wifinetworkProm);

            }


            Promise.all(fetchPromises).then(function (results0) {

                response.send({
                    memberships: memberships,
                    checkpoints: checkpoints,
                    controllers: controllers,
                    wifiNetworks: wifiNetworks,
                });

            }, function (reason) {
                // rejection
            });


        }, function (reason) {
            // rejection
        });

    }, function (error) {
        // The Promise was rejected.
        response.send(error);
        console.error(error);
    });
});


exports.getDataForCheckpoint = functions.https.onRequest((request, response) => {

    let checkpointId = request.query.checkpointId;

    if (checkpointId === undefined) {
        response.status = 400;
        response.send({ error: 'Missing query parameter \'checkpointId\' ' });
        return;
    }


    admin.database().ref().child('checkpoints').orderByKey().equalTo(checkpointId).once('value').then(function (snapshot) {

        let memberships = [];

        let fetchMembershipPromises = [];

        let checkpoints = [];

        let gates = [];

        snapshot.forEach(function (child) {
            let value = child.val();
            checkpoints.push(child.val());

            for (let membershipId of value.membershipIds) {

                let a = admin.database().ref().child('memberships').orderByKey().equalTo(membershipId).once('value').then(function (snapshot1) {

                    snapshot1.forEach(function (child1) {
                        // var value = child1.val();
                        memberships.push(child1.val());

                    });

                }, function (error3) {
                    // The Promise was rejected.
                    response.send(error3);
                    console.error(error3);
                });

                fetchMembershipPromises.push(a);

            }

            for (let gateId of value.gateIds) {

                let gateProm = admin.database().ref().child('gates').orderByKey().equalTo(gateId).once('value').then(function (snapshot4) {

                    snapshot4.forEach(function (child4) {
                        // var value = child1.val();
                        gates.push(child4.val());
                    });

                }, function (error4) {
                    // The Promise was rejected.
                    response.send(error4);
                    console.error(error4);
                });

                fetchMembershipPromises.push(gateProm);
            }

        });

        Promise.all(fetchMembershipPromises).then(function (results) {

            response.send({
                checkpoints: checkpoints,
                gates: gates,
                memberships: memberships,
            });

        }, function (reason) {
            // rejection
        });

    }, function (error) {
        // The Promise was rejected.
        response.send(error);
        console.error(error);
    });
});