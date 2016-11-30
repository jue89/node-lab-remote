const gpio = require( './gpio.js' );

const PIN_LE   =  4;
const PIN_C05  = 17;
const PIN_C10  = 27;
const PIN_C20  = 22;
const PIN_C40  = 23;
const PIN_C80  = 24;
const PIN_C160 = 25;

const le = gpio.out( PIN_LE );
const c = [
	gpio.out( PIN_C05 ),
	gpio.out( PIN_C10 ),
	gpio.out( PIN_C20 ),
	gpio.out( PIN_C40 ),
	gpio.out( PIN_C80 ),
	gpio.out( PIN_C160 )
];


function timeout( delay ) { return new Promise( ( resolve ) => {
	setTimeout( () => resolve(), delay );
} ); }

let curAtn = 0;

function setAtn( atn ) {

	atn = Math.round( atn * 2 );
	if( atn < 0 ) atn = 0;
	if( atn > 63 ) atn = 63;

	let jobs = [];
	for( let i = 1, j = 0; i <= 32; i = i * 2, j = j + 1 ) {
		 jobs.push( c[j].w( atn & i ) );
	}

	return Promise.all( jobs )
		.then( () => le.w( true ) )
		.then( () => timeout( 1 ) )
		.then( () => le.w( false ) )
		.then( () => {
			curAtn = atn / 2;
			return curAtn;
		} );


}

function getAtn() {
	return curAtn;
}

// Reset
le.w( false ).then( () => setAtn( 0 ) );

module.exports = {
	getAtn: getAtn,
	setAtn: setAtn,
	close: gpio.close
};
