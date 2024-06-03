<script setup lang="ts">
import { ref } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import { WaveSurferPlayer } from '@meersagor/wavesurfer-vue'
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js"
import Slider from 'primevue/slider';
import InputText from 'primevue/inputtext'




const options = ref({
  height: 48,
  waveColor: 'gray',
  progressColor: 'red',
  barGap: 5,
  barWidth: 5,
  barRadius: 8,
  duration: 80,
  url: "https://revews-bucket.s3.ap-southeast-1.amazonaws.com/a06mmMU3sgnzuUkH4OiHvyuUgCFdLSnJaDLBao7y.webm",
  plugins: []
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
        color: 'rgba(255, 0, 0, 0.1)',
    });

    wsRegions?.value?.on('region-updated', function (region) {
        console.log('Updated region', region);
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
        console.log('region-in', region);
        currentRegion.value = region;
      });

      wsRegions?.value?.on('region-out', (region) => {
        console.log('region-out', region, currentRegion.value.id === region.id);
        
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
  if (waveSurfer.value) {
    wsRegions.value?.clearRegions()
    // wsRegions?.value?.unAll()
    // setupRegionLoopingEvents();
  }
}

const loopRegion = () => {
    isLoopingEnabled.value = !isLoopingEnabled.value;
}

const togglePlay = () => {
    waveSurfer?.value?.playPause()
}

const onSpeedSliderChange = () => {
  console.log('onSpeedSliderChange')

  const preservePitch = true;
  waveSurfer?.value?.setPlaybackRate(speed.value / 100 , preservePitch)
  waveSurfer?.value?.play()

}

const onVolumeSliderChange = () => {
  console.log('onVolumeSliderChange')

  waveSurfer?.value?.setVolume(volume.value / 100)
  waveSurfer?.value?.play()

}

</script>

<template>
  <main>
    <h1>WaveSurferPlayer Using Components</h1>
    <WaveSurferPlayer
      :options="options"
      @timeupdate="(time: number) => timeUpdateHandler(time)"
      @ready="(duration: number) => readyHandler(duration)"
      @waveSurfer="(ws: WaveSurfer) => readyWaveSurferHandler(ws)"
    />
    <p>currentTime: {{ currentTime }}</p>
    <p>totalDuration: {{ totalDuration }}</p>
    <button @click="togglePlay" :style="{ minWidth: '5em' }">Play</button>
    <button @click="loopRegion" :style="{ minWidth: '5em' }">{{ isLoopingEnabled ? 'Disable Loop' : 'Enable Loop' }}</button>
    <button @click="clearRegions" :style="{ minWidth: '5em' }">Clear Loops</button>
    
    <div class="flex flex-col gap-2 card flex justify-center w-[24rem] mx-auto">
      <label for="username">Speed: {{speed}}%</label>
      <Slider v-model="speed" @change="onSpeedSliderChange" class="w-full" :min="20" :max="150" :step="5" />      
    </div>

    <div class="flex flex-col gap-2 card flex justify-center w-[24rem] mx-auto">
      <label for="username">Volume: {{volume}}%</label>
      <Slider v-model="volume" @change="onVolumeSliderChange" class="w-full" :min="0" :max="100" :step="5" />      
    </div>

  </main>
</template>