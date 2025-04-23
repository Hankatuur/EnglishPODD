
































import React, { useRef, useEffect, useState } from 'react'
import { 
  Box, SimpleGrid, Text, useColorModeValue, Center, Icon,
  AbsoluteCenter, IconButton, Flex,
  Grid
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import confetti from 'canvas-confetti'
import ReactPlayer from 'react-player'
import { FaPlay } from 'react-icons/fa'

const jump = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`

const StatCard = ({ title, text, color }) => {
  const glowColor = useColorModeValue(
    `hsla(${color}, 0.4)`,
    `hsla(${color}, 0.7)`
  )

  return (
    <Box
      p={6}
      borderRadius="lg"
      bg={useColorModeValue(`hsla(${color}, 0.1)`, `hsla(${color}, 0.2)`)}
      borderWidth="1px"
      _hover={{
        boxShadow: `0 0 25px ${glowColor}`,
        animation: `${jump} 0.5s ease`,
      }}
      transition="all 0.3s ease"
    >
      <Text fontSize="4xl" fontWeight="bold" color={`hsl(${color})`}>
        {title}
      </Text>
      <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.300')}>
        {text}
      </Text>
    </Box>
  )
}

const StatsSection = () => {
  const playerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const confettiCanvasRef = useRef(null)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    confettiCanvasRef.current = canvas
    document.body.appendChild(canvas)

    return () => {
      document.body.removeChild(canvas)
    }
  }, [])

  const runConfetti = () => {
    const confettiInstance = confetti.create(confettiCanvasRef.current, {
      resize: true,
      useWorker: true
    })

    confettiInstance({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFA500', '#FF6347', '#FFD700']
    })
  }

  const handlePlay = () => {
    setIsPlaying(true)
    setShowPlayButton(false)
  }

  return (
    <Box py={16} px={{ base: 4, md: 8 }} bg={useColorModeValue('gray.50', 'gray.800')}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={16}>
      <StatCard title="3.3K" text="Students Enrolled" color="170, 75%, 41%" />
      <StatCard title="100%" text="Satisfaction Rate" color="260, 100%, 67%" />
      <StatCard title="24/7" text="Support Available" color="351, 83%, 61%" />
    </Grid>

      <Box 
        maxW="800px" 
        mx="auto" 
        borderRadius="20px"
        overflow="hidden"
        boxShadow="xl"
        position="relative"
      >
        {showPlayButton && (
          <AbsoluteCenter zIndex={1}>
            <IconButton
              aria-label="Play video"
              icon={<FaPlay />}
              colorScheme="orange"
              isRound
              size="lg"
              fontSize="24px"
              onClick={handlePlay}
            />
          </AbsoluteCenter>
        )}

        <ReactPlayer
          ref={playerRef}
          url="/Vidoes/welcome.mp4"
          width="100%"
          height="400px"
          playing={isPlaying}
          controls={true}
          onEnded={runConfetti}
          style={{
            borderRadius: '20px',
            overflow: 'hidden'
          }}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload'
              }
            }
          }}
        />
      </Box>
    </Box>
  )
}

export default StatsSection
































