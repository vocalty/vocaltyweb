import pause from "../../assets/pause.png"
import play from "../../assets/continue.png"
import forward from "../../assets/forward10sec.png"
import backward from "../../assets/backward10sec.png"
export default function AudioPlayer({formatDuration, steps,index,handleAudio,handleBackward,handleForward,handlePlayPause,handleSeek,isPlaying,currentTime,duration,audioRef}) {
    return (
                <>
                    {/* <div className=' absolute bottom-0 left-1/2 rounded-3xl z-50 bg-white border-2 border-gray-900'> */}
                        <div className='md:w-[70%] w-[90%] absolute md:bottom-4 bottom-[60px] md:left-1/4 left-4 rounded-3xl z-50 bg-white border-4 border-light-blue-900 px-5 flex items-center justify-evenly'>
                            <div className='md:h-[200px] h-[150px] w-[450px] px-2 flex justify-center p-5'>
                                <img className='w-full rounded' src={steps[index]?.image_url} alt='place'/>
                            </div>
                            <div className="flex md:flex-col flex-col">
                                <h1 className='md:inline-block hidden text-center font-medium text-xl text-[#04A2D3]'>
                                    {steps[index]?.caption}
                                </h1>
                                <div className="md:hidden flex flex-row-reverse items-end gap-2">
                                    <div className="flex flex-col">
                                        <div>
                                            <h6 className='text-center font-medium text-sm text-[#04A2D3]'>
                                                {steps[index]?.caption}
                                            </h6>
                                        </div>
                                        <div className="flex flex-col">
                                            <input className='md:w-[230px] w-[100px]' min="0" max={duration} value={currentTime} onChange={handleSeek} type='range' />
                                            <div className='flex justify-between w-full'>
                                                <div>{formatDuration(currentTime)}</div>
                                                <div>{formatDuration(steps[index]?.audio_duration)}</div>
                                            </div>
                                            <div className="flex justify-between w-full">
                                                <button className='md:hidden block hover:bg-gray-200 px-1' onClick={handleBackward}><img className='h-8 w-8' src={backward} alt=''/></button>
                                                <button className='md:hidden block hover:bg-gray-200 px-1' onClick={handleForward}><img className='h-8 w-8' src={forward} alt=''/></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='flex justify-between items-baseline md:pb-2 pb-[2.8rem]'>
                                                <button className='md:block hidden hover:bg-gray-200 px-1' onClick={handleBackward}><img className='h-8 w-8' src={backward} alt=''/></button>
                                                <div onClick={handlePlayPause}>
                                                    {
                                                        isPlaying ?
                                                            <div className='flex justify-center'>
                                                                <button className='flex justify-center items-center md:h-14  md:w-14 h-8 w-8 rounded-full border-2 border-[#04A2D3] hover:bg-sky-100 bg-white font-medium hover:bg-blue-600'>
                                                                    <img src={pause} alt='pause t' />
                                                                </button>
                                                            </div>
                                                            :
                                                            <div className='flex justify-center'>
                                                                <button className='flex justify-center items-center md:h-14  md:w-14 h-8 w-8 rounded-full border-2 border-[#04A2D3] bg-white hover:bg-sky-100 font-medium hover:bg-blue-600'>
                                                                    <img src={play} alt='play' />
                                                                </button>
                                                            </div>
                                                    }
                                                </div>
                                                <button className='md:block hidden px-1 hover:bg-gray-200' onClick={handleForward}><img className='h-8 w-8' src={forward} alt=''/></button>
                                        </div>
                                    </div>
                                </div>
                                <input className='md:w-[230px] w-[100px] md:inline-block hidden' min="0" max={duration} value={currentTime} onChange={handleSeek} type='range' />
                                <div className='md:flex justify-between w-full hidden'>
                                    <div>{formatDuration(currentTime)}</div>
                                    <div>{formatDuration(steps[index]?.audio_duration)}</div>
                                </div>
                                <div className='md:flex hidden justify-between items-baseline'>
                                    <button className='md:block hidden hover:bg-gray-200 px-1' onClick={handleBackward}><img className='h-8 w-8' src={backward} alt=''/></button>
                                    <div onClick={handlePlayPause}>
                                        {
                                            isPlaying ?
                                                <div className='flex justify-center'>
                                                    <button className='flex justify-center items-center md:h-14  md:w-14 h-8 w-8 rounded-full border-2 border-[#04A2D3] hover:bg-sky-100 bg-white font-medium hover:bg-blue-600'>
                                                        <img src={pause} alt='pause' />
                                                    </button>
                                                </div>
                                                :
                                                <div className='flex justify-center'>
                                                    <button className='flex justify-center items-center md:h-14  md:w-14 h-8 w-8 rounded-full border-2 border-[#04A2D3] bg-white hover:bg-sky-100 font-medium hover:bg-blue-600'>
                                                        <img src={play} alt='play' />
                                                    </button>
                                                </div>
                                        }
                                    </div>
                                    <button className='md:block hidden px-1 hover:bg-gray-200' onClick={handleForward}><img className='h-8 w-8' src={forward} alt=''/></button>
                                </div>
                                <audio className='md:w-[130px]' ref={audioRef} src={steps[index]?.audio_url}/>
                            </div>
                            
                        </div>
                    {/* </div>   */}
                </>
    );
}