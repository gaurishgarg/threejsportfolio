const app = require('./app');
// const os = require( 'os' );
// var networkInterfaces = os.networkInterfaces();
// console.log(networkInterfaces['Wi-Fi'][1].address);
app.listen(process.env.PORT || 3000,function() {
    console.log('listening on port 3000');
});
