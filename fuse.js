const { FuseBox, WebIndexPlugin, CSSPlugin } = require("fuse-box");
const workboxBuild = require('workbox-build');
const pwaManifest = require('@pwa/manifest');
const targDir= 'dev';

const fuse = FuseBox.init({
    homeDir : "src",
    target : 'browser@es6',
    output : `${targDir}/$name.js`,
    allowSyntheticDefaultImports: true,
    plugins : [
        WebIndexPlugin({
            template:'src/index.html',
            useTypescriptCompiler: true
        }),
        [
            CSSPlugin({
                group:'bundle.css',
                outFile:`${targDir}/bundle.css`,
            }),
        ]
    ]
});

fuse.dev(); // launch http server
fuse.bundle("app").instructions(" > index.js").hmr({reload:true}).watch();

let fc = fuse.run();
fc.then(()=>{
	workboxBuild.injectManifest({
		swSrc: 'sw.js',
		swDest: '${targDir}/sw.js',
		globDirectory: targDir,
		globPatterns:[
			'**\/*.{js,css,html,png}'
		]
	}).then((count,size)=>{
		console.log(`$(count} files are being cached, totalling ${size} bytes.`)
	})
});

pwaManifest({
	name:"agora video call",
	short_name: "Agora VC",
	start:'/index.html',
	icons:[
	{
		src:'https://i.ibb.co/pJ2MWmd/pwa-192x192.png',
		sizes:'192x192',
		type:'image/png'
	},
	{
		src:'https://i.ibb.co/pJ2MWmd/pwa-512x512.png',
		sizes:'512x512',
		type:'image/png'
	}],
	display:'standalone',
	theme_coloe:'#317EFB'
}).then(manifest=>{pwaManifest.write(targDir,manifest)});