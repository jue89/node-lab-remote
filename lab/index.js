const LO = require( './lib/lo.js' );
const dat = require( './lib/dat.js' );

const lo1 = LO.connect( 28 );
const lo2 = LO.connect( 27 );

module.exports = function( io ) {

	/* LO1 */

	let curLO1Freq;
	let curLO1Power;
	let curLO1State;

	Promise.all( [ lo1.getFreq(), lo1.getPower(), lo1.getState() ] ).then( ( result ) => {
		curLO1Freq = result[0];
		curLO1Power = result[1];
		curLO1State = result[2];
	} ); 

	function setLO1Freq( freq ) {
		lo1.setFreq( parseInt( freq ) ).then( ( freq ) => {
			curLO1Freq = freq;
			io.emit( 'lo1.freq', freq );
		} );
	}

	function setLO1Power( power ) {
		lo1.setPower( parseInt( power ) ).then( ( power ) => {
			curLO1Power = power;
			io.emit( 'lo1.power', power );
		} );
	}

	function setLO1State( state ) {
		lo1.setState( state ).then( ( state ) => {
			curLO1State = state;
			io.emit( 'lo1.state', state );
		} );
	}



	/* LO2 */

	let curLO2Freq;
	let curLO2Power;
	let curLO2State;

	Promise.all( [ lo2.getFreq(), lo2.getPower(), lo2.getState() ] ).then( ( result ) => {
		curLO2Freq = result[0];
		curLO2Power = result[1];
		curLO2State = result[2];
	} ); 

	function setLO2Freq( freq ) {
		lo2.setFreq( parseInt( freq ) ).then( ( freq ) => {
			curLO2Freq = freq;
			io.emit( 'lo2.freq', freq );
		} );
	}

	function setLO2Power( power ) {
		lo2.setPower( parseInt( power ) ).then( ( power ) => {
			curLO2Power = power;
			io.emit( 'lo2.power', power );
		} );
	}

	function setLO2State( state ) {
		lo2.setState( state ).then( ( state ) => {
			curLO2State = state;
			io.emit( 'lo2.state', state );
		} );
	}



	/* DAT */

	let curDAT = dat.getAtn();
	
	function setDAT( atn ) {
		dat.setAtn( atn ).then( ( atn ) => {
			curDAT = atn;
			io.emit( 'dat.atn', atn );
		} );
	}



	/* Socket.io */

	io.on( 'connection', ( socket ) => {

		socket.emit( 'lo1.freq', curLO1Freq );
		socket.on( 'lo1.freq', ( freq ) => setLO1Freq( freq ) );
		socket.emit( 'lo1.power', curLO1Power );
		socket.on( 'lo1.power', ( power ) => setLO1Power( power ) );
		socket.emit( 'lo1.state', curLO1State );
		socket.on( 'lo1.state', ( state ) => setLO1State( state ) );

		socket.emit( 'lo2.freq', curLO2Freq );
		socket.on( 'lo2.freq', ( freq ) => setLO2Freq( freq ) );
		socket.emit( 'lo2.power', curLO2Power );
		socket.on( 'lo2.power', ( power ) => setLO2Power( power ) );
		socket.emit( 'lo2.state', curLO2State );
		socket.on( 'lo2.state', ( state ) => setLO2State( state ) );

		socket.emit( 'dat.atn', curDAT );
		socket.on( 'dat.atn', ( atn ) => setDAT( atn ) );

	} );

}
