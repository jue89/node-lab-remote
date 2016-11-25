const onoff = require('onoff').Gpio;

class Out {
	constructor( pin ) {
		this._pin = new onoff( pin, 'out' );
	}
	
	w( value ) {
		if( ! this._pin ) return Promise.reject( new Error( "Pin is closed" ) );

		return new Promise( ( resolve, reject ) => {
			this._pin.write( value ? 1 : 0, ( err ) => {
				if( err ) reject( err );
				else resolve();
			} );
		} );
	}
	
	r() {
		if( ! this._pin ) return Promise.reject( new Error( "Pin is closed" ) );

		return new Promise( ( resolve, reject ) => {
			this._pin.read( ( err, value ) => {
				if( err ) reject( err );
				else resolve( value );
			} );
		} );
	}

	close() {
		if( this._pin ) this._pin.unexport();
		delete this._pin;
	}

}

let pins = [];

function out( pin ) {
	const p = new Out( pin );
	pins.push( p );
	return p;
}

function close() {
	pins.forEach( (p) => p.close() );
}

module.exports = { out, close };
