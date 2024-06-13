<script setup lang="ts">
import { ref } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import { WaveSurferPlayer } from '@meersagor/wavesurfer-vue'
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js"
import Minimap from 'wavesurfer.js/dist/plugins/minimap.js'
import Slider from 'primevue/slider';
import FileUpload from 'primevue/fileupload'




const options = ref({
  height: 120,
  width: '80vw',
  waveColor: 'gray',
  progressColor: 'red',
  barGap: 5,
  barWidth: 5,
  barRadius: 8,
  duration: 80,
  plugins: [
    // Register the plugin
    Minimap.create({
      height: 20,
      waveColor: '#ddd',
      progressColor: '#999',
      // the Minimap takes all the same options as the WaveSurfer itself
    }),
  ]
})

const currentTime = ref<string>('00:00')
const totalDuration = ref<string>('00:00')
const waveSurfer = ref<WaveSurfer | null>(null)
const wsRegions = ref<RegionsPlugin | null>(null)
const currentRegion = ref<any>(null)
const isLoopingEnabled = ref<boolean>(true)
const start = ref<any>(false)
const end = ref<any>(false)
const speed = ref<number>(100)
const volume = ref<number>(100)
const zoom = ref<number>(100)
const isPlaying = ref<boolean>(false)


const formatTime = (seconds: number): string => [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':')

const timeUpdateHandler = (time: number) => {
  currentTime.value = formatTime(time)
}

const readyHandler = (duration: number) => {
  totalDuration.value = formatTime(duration)
}

const readyWaveSurferHandler = (ws: WaveSurfer) => {
    // setup wavesurfer //
    waveSurfer.value = ws

    const regionsSetup = waveSurfer.value?.registerPlugin(RegionsPlugin.create())
    if (regionsSetup) {
        wsRegions.value = regionsSetup
    }


    // setup regions //
    wsRegions?.value?.enableDragSelection({
        color: 'rgba(50, 200, 100, 0.2)',
    });

    wsRegions?.value?.on('region-updated', function (region) {
        start.value = region.start;
        end.value = region.end;
    });

    wsRegions?.value?.on('region-created', (region) => {
       
      });
    
    setupRegionLoopingEvents();


      wsRegions?.value?.on('region-clicked', (region, e) => {
        e.stopPropagation(); // prevent triggering a click on the waveform
        currentRegion.value = region;
        region.play();
        // region.setOptions({ color: randomColor() });
      });

      // Reset the active region when the user clicks anywhere in the waveform
      waveSurfer?.value?.on('interaction', () => {
        currentRegion.value = null;
      });


}


const setupRegionLoopingEvents = () => {
      wsRegions?.value?.on('region-in', (region) => {
        currentRegion.value = region;
      });

      wsRegions?.value?.on('region-out', (region) => {
        if (currentRegion.value.id === region.id) {
          if (isLoopingEnabled.value) {
            region.play();
          } else {
            currentRegion.value = null;
          }
        }
      });
    }

    

const clearRegions = () => {
  if (waveSurfer.value && wsRegions?.value) {
    let regionLoops = wsRegions?.value?.getRegions();
    regionLoops.forEach(x => {
      console.log(x)
      try {
        x.remove();
      }
      catch(err) {
        // ignore
      }
    })
  }
}

const loopRegion = () => {
    isLoopingEnabled.value = !isLoopingEnabled.value;
}

const togglePlay = () => {
    waveSurfer?.value?.playPause()

    isPlaying.value = waveSurfer?.value?.isPlaying() ?? false;
}

const onSpeedSliderChange = () => {
  const preservePitch = true;
  waveSurfer?.value?.setPlaybackRate(speed.value / 100 , preservePitch)
  waveSurfer?.value?.play()
}

const onVolumeSliderChange = () => {
  waveSurfer?.value?.setVolume(volume.value / 100)
  waveSurfer?.value?.play()
}

const onZoomSliderChange = () => {
  waveSurfer?.value?.zoom(zoom.value)
}

const themeToggle = () => {
  let x = document.childNodes[1] as HTMLElement; 

  if(x.classList.contains('dark'))
    x.classList.replace('dark', 'light')
  else
    x.classList.replace('light', 'dark')
}

const customBase64Uploader = async (event) => {
  const file = event.files[0];
  const url = URL.createObjectURL(file);
  waveSurfer?.value?.load(url);
};

</script>

<template>
  <main>
    <WaveSurferPlayer
      :options="options"
      @timeupdate="(time: number) => timeUpdateHandler(time)"
      @ready="(duration: number) => readyHandler(duration)"
      @waveSurfer="(ws: WaveSurfer) => readyWaveSurferHandler(ws)"
    />

    <div class="flex justify-center">
      <p>{{ currentTime }}</p>
      <span> / </span>
      <p>{{ totalDuration }}</p>
    </div>

    <FileUpload mode="basic" :auto="true" name="demo[]" @select="customBase64Uploader" :maxFileSize="50000000" :customUpload="true" @upload="customBase64Uploader" />
    <button @click="togglePlay" :style="{ minWidth: '5em' }">{{!isPlaying? "Play": "Pause" }}</button>
    <button @click="loopRegion" :style="{ minWidth: '5em' }">{{ isLoopingEnabled ? 'Disable Loop' : 'Enable Loop' }}</button>
    <button @click="clearRegions" :style="{ minWidth: '5em' }">Clear Loops</button>
    <button @click="themeToggle" :style="{ minWidth: '5em' }">Theme</button>
    
    <div class="flex flex-col gap-2 card flex justify-center w-[24rem] mx-auto">
      <label for="spped">Speed: {{speed}}%</label>
      <Slider v-model="speed" @change="onSpeedSliderChange" class="w-full" :min="20" :max="150" :step="5" />      
    </div>

    <div class="flex flex-col gap-2 card flex justify-center w-[24rem] mx-auto">
      <label for="volume">Volume: {{volume}}%</label>
      <Slider v-model="volume" @change="onVolumeSliderChange" class="w-full" :min="0" :max="100" :step="5" />      
    </div>

    <div class="flex flex-col gap-2 card flex justify-center w-[24rem] mx-auto">
      <label for="zoom">Zoom: {{zoom}}%</label>
      <Slider v-model="zoom" @change="onZoomSliderChange" class="w-full" :min="1" :max="100" :step="1" />      
    </div>

  </main>
</template>