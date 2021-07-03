#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jul  3 17:42:53 2021

@author: gaspar
"""

from PIL import Image, ImageEnhance
import os

img_files = [s for s in os.listdir('./originals') if s.endswith(('bmp', 'jpg', 'png')) ]

for fname in sorted(img_files):
    print(fname)
    thismode = ''
    im = Image.open('./originals/' + fname)
    if im.mode == 'P':
        thismode = 'P'
        print('P convert...')
        im = im.convert('RGB')
    
    enhancer = ImageEnhance.Brightness(im)
    im_output = enhancer.enhance(0.01)
    if thismode == 'P':
        im_output = im_output.convert('P')
    im_output.save(fname.replace('.', '_black.'))
    
    enh1 = ImageEnhance.Contrast(im)
    im_output = enh1.enhance(0.1)
    enh2 = ImageEnhance.Brightness(im_output)
    im_output = enh2.enhance(10)
    if thismode == 'P':
        im_output = im_output.convert('P')
    im_output.save(fname.replace('.', '_white.'))
    
    