const gpib = require( 'linux-gpib' )( 0 );

class LO {

	constructor( pad ) {

		let dev = gpib.connect( { pad: pad, timeout: 'T3s' } );

		this._gpib = dev.write( [ '*CLS', '*RST' ] ).then( () => {
			return dev;
		} );
	}

	getState() { return this._gpib.then( ( gpib ) => {

		return gpib.query( 'OUTPUT:STATE?' ).then( ( res ) => {
			return ( parseInt( res ) == 1 );
		} );

	} ); }

	getFreq() { return this._gpib.then( ( gpib ) => {

		return gpib.query( 'SOURCE:FREQUENCY?' ).then( ( res ) => {
			return parseFloat( res );
		} );

	} ); }

	getPower() { return this._gpib.then( ( gpib ) => {

		return gpib.query( 'SOURCE:POWER?' ).then( ( res ) => {
			return parseFloat( res );
		} );

	} ); }



	setState( state ) { return this._gpib.then( ( gpib ) => {
		
		return gpib.write( 'OUTPUT ' + ( state ? 'ON' : 'OFF' ) ).then( () => {
			return this.getState();
		} );

	} ); }

	setFreq( freq ) { return this._gpib.then( ( gpib ) => {
	
		return gpib.write( `SOURCE:FREQUENCY ${freq}` ).then( () => {
			 return this.getFreq();
		} );

	} ); }

	setPower( power ) { return this._gpib.then( ( gpib ) => {

		return gpib.write( `SOURCE:POWER ${power}` ).then( () => {
			return this.getPower();
		} );

	} ); }

	
	disconnect() { return this._gpib.then( ( gpib ) => {

		gpib.disconnect();

	} ); }
	
}

let devs = [];
function connect( pad ) {
	let dev = new LO( pad );
	devs.push( dev );		
	return dev;
}

function disconnect() {
	let jobs = [];
	devs.forEach( (d) => jobs.push( d.disconnect() ) );
	return Promise.all( jobs );
}

module.exports = { connect, disconnect };
