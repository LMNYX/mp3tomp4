const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const prompts = require('prompts');
const fs = require('fs');
const path = require('path');
const { getAudioDurationInSeconds } = require('get-audio-duration');

ffmpeg.setFfmpegPath(ffmpegPath);

if(!fs.existsSync(__dirname+'/output'))
    fs.mkdirSync('output');

const _output = path.join(__dirname, 'output');

async function main()
{
    const res = await prompts({'type': 'text', 'name': 'mpdir', 'message': 'Paste path to the folder',
    'validate': function(x)
    {
        return fs.existsSync(x) ? true : 'Please enter valid path';
    }});
    if( !fs.existsSync(res.mpdir+'/preview.jpg') )
    {
        console.log("ERROR: preview.jpg doesn't exist.");
        return;
    }
    let preview = path.join(res.mpdir , "/preview.jpg");
    let mpthrees = fs.readdirSync(res.mpdir, {withFileTypes: true})
    .filter(item => item.name.endsWith('mp3'))
    .map(item => path.join(res.mpdir, item.name));

    for(mp in mpthrees)
    {
        let _curr = mpthrees[mp];
        let _name = _curr.split('\\');
        _name = _name[_name.length - 1].split('.')[0];
        let _len  = await getAudioDurationInSeconds(_curr);
        test = ffmpeg().videoCodec('mpeg4').format('avi');
        test.input(preview)
        .duration(_len);
        test.input(_curr)
        .duration(_len);

        test.output(path.join(_output, `${_name}.mp4`));

        test.run();
    }

    return;
    
}


main().then(()=>{}).catch((x)=>{console.log(x);});