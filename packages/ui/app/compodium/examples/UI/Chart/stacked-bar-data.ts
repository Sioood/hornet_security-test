import type { ChartLegendSeries } from '@/utils/Components/Chart/context'

export type MusicFormatRecord = {
  year: number
  vinyl: number
  cassette: number
  cd: number
  download: number
  streaming: number
}

export const musicFormatSeries: ChartLegendSeries[] = [
  { color: 'var(--vis-color0)', key: 'vinyl', label: 'Vinyl' },
  { color: 'var(--vis-color1)', key: 'cassette', label: 'Cassette' },
  { color: 'var(--vis-color2)', key: 'cd', label: 'CD' },
  { color: 'var(--vis-color3)', key: 'download', label: 'Download' },
  { color: 'var(--vis-color4)', key: 'streaming', label: 'Streaming' },
]

export const musicFormatData: MusicFormatRecord[] = [
  { cassette: 0.5806, cd: 0, download: 0, streaming: 0, vinyl: 1.436, year: 1973 },
  { cassette: 0.6497, cd: 0, download: 0, streaming: 0, vinyl: 1.55, year: 1974 },
  { cassette: 0.692, cd: 0, download: 0, streaming: 0, vinyl: 1.6965, year: 1975 },
  { cassette: 0.829, cd: 0, download: 0, streaming: 0, vinyl: 1.9081, year: 1976 },
  { cassette: 1.0606, cd: 0, download: 0, streaming: 0, vinyl: 2.4402, year: 1977 },
  { cassette: 1.3978, cd: 0, download: 0, streaming: 0, vinyl: 2.7336, year: 1978 },
  { cassette: 1.2649, cd: 0, download: 0, streaming: 0, vinyl: 2.4106, year: 1979 },
  { cassette: 1.232, cd: 0, download: 0, streaming: 0, vinyl: 2.45, year: 1980 },
  { cassette: 1.3758, cd: 0, download: 0, streaming: 0, vinyl: 2.5981, year: 1981 },
  { cassette: 1.4205, cd: 0, download: 0, streaming: 0, vinyl: 2.2081, year: 1982 },
  { cassette: 1.8109, cd: 0.0172, download: 0, streaming: 0, vinyl: 1.9583, year: 1983 },
  { cassette: 2.3839, cd: 0.1033, download: 0, streaming: 0, vinyl: 1.8475, year: 1984 },
  { cassette: 2.4115, cd: 0.3895, download: 0, streaming: 0, vinyl: 1.5615, year: 1985 },
  { cassette: 2.4995, cd: 0.9301, download: 0, streaming: 0, vinyl: 1.2111, year: 1986 },
  { cassette: 2.974, cd: 1.5936, download: 0, streaming: 0, vinyl: 0.9964, year: 1987 },
  { cassette: 3.4424, cd: 2.0997, download: 0, streaming: 0, vinyl: 0.7126, year: 1988 },
  { cassette: 3.5404, cd: 2.7024, download: 0, streaming: 0, vinyl: 0.3367, year: 1989 },
  { cassette: 3.7303, cd: 3.6299, download: 0, streaming: 0, vinyl: 0.1809, year: 1990 },
  { cassette: 3.25, cd: 4.4909, download: 0, streaming: 0, vinyl: 0.0933, year: 1991 },
  { cassette: 3.4151, cd: 5.529, download: 0, streaming: 0, vinyl: 0.0799, year: 1992 },
  { cassette: 3.2143, cd: 6.7705, download: 0, streaming: 0, vinyl: 0.0618, year: 1993 },
  { cassette: 3.2513, cd: 8.7517, download: 0, streaming: 0, vinyl: 0.065, year: 1994 },
  { cassette: 2.5399, cd: 9.7086, download: 0, streaming: 0, vinyl: 0.0718, year: 1995 },
  { cassette: 2.0946, cd: 10.3549, download: 0, streaming: 0, vinyl: 0.0843, year: 1996 },
  { cassette: 1.6562, cd: 10.5117, download: 0, streaming: 0, vinyl: 0.0689, year: 1997 },
  { cassette: 1.5143, cd: 12.1372, download: 0, streaming: 0, vinyl: 0.0597, year: 1998 },
  { cassette: 1.1096, cd: 13.4154, download: 0, streaming: 0, vinyl: 0.0597, year: 1999 },
  { cassette: 0.6306, cd: 13.6391, download: 0, streaming: 0, vinyl: 0.054, year: 2000 },
  { cassette: 0.3581, cd: 13.324, download: 0, streaming: 0, vinyl: 0.0588, year: 2001 },
  { cassette: 0.2082, cd: 12.3606, download: 0, streaming: 0, vinyl: 0.0454, year: 2002 },
  { cassette: 0.1081, cd: 11.7031, download: 0, streaming: 0, vinyl: 0.0432, year: 2003 },
  { cassette: 0.0237, cd: 12.0918, download: 0.1835, streaming: 0.0069, vinyl: 0.0392, year: 2004 },
  { cassette: 0.0131, cd: 11.1545, download: 0.9243, streaming: 0.1709, vinyl: 0.0274, year: 2005 },
  { cassette: 0.0037, cd: 9.8393, download: 1.65, streaming: 0.2407, vinyl: 0.0256, year: 2006 },
  { cassette: 0.003, cd: 7.9558, download: 2.3924, streaming: 0.272, vinyl: 0.0269, year: 2007 },
  { cassette: 0.0009, cd: 5.7064, download: 2.6859, streaming: 0.323, vinyl: 0.0596, year: 2008 },
  { cassette: 0, cd: 4.5355, download: 2.66, streaming: 0.3629, vinyl: 0.0663, year: 2009 },
  { cassette: 0, cd: 3.5725, download: 2.6934, streaming: 0.4631, vinyl: 0.0912, year: 2010 },
  { cassette: 0, cd: 3.257, download: 2.9018, streaming: 0.6554, vinyl: 0.124, year: 2011 },
  { cassette: 0, cd: 2.607, download: 3.0162, streaming: 1.0362, vinyl: 0.1655, year: 2012 },
  { cassette: 0, cd: 2.2501, download: 2.9203, streaming: 1.4608, vinyl: 0.2137, year: 2013 },
  { cassette: 0, cd: 1.8725, download: 2.5531, streaming: 1.8352, vinyl: 0.2493, year: 2014 },
  { cassette: 0, cd: 1.5231, download: 2.3107, streaming: 2.3421, vinyl: 0.3391, year: 2015 },
  { cassette: 0, cd: 1.192, download: 1.8294, streaming: 4.0019, vinyl: 0.3603, year: 2016 },
  { cassette: 0, cd: 1.1009, download: 1.3853, streaming: 5.7167, vinyl: 0.3946, year: 2017 },
  { cassette: 0, cd: 0.7303, download: 1.0173, streaming: 7.4368, vinyl: 0.4245, year: 2018 },
  { cassette: 0, cd: 0.6439, download: 0.8326, streaming: 8.9132, vinyl: 0.5044, year: 2019 },
]

/** Demo values are in billions USD; scale for compact currency display. */
export function formatMusicRevenue(value: number): string {
  return Intl.NumberFormat('en-US', {
    currency: 'USD',
    notation: 'compact',
    style: 'currency',
  }).format(value * 1e10)
}
