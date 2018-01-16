#!/bin/bash
# Nabyl Bennouri - 1/16/2018

# parse arguments
POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"
case $key in
    -f|--function)
    FUNCTION="$2"
    shift # past argument
    shift # past value
    ;;
    -v|--verbose)
    VERBOSE="$2"
    shift # past argument
    shift # past value
    ;;
    -e|--event)
    EVENT="$2"
    shift # past argument
    shift # past value
    ;;
    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

# debug
# echo FUNCTION  = "${FUNCTION}"
# echo VERBOSE     = "${VERBOSE}"

# error handling
if [[ -n $1 ]]; then
    echo "Last line of file specified as non-opt/last argument:"
    tail -1 "$1"
fi

# test call
if [ "${FUNCTION}" == "" ]
then
  echo "Missing function name. Please call a function with the -f switch. Example: -f weather"
  exit
fi

if [ "${EVENT}" == "" ]
then
  echo "Missing event file name. Please point to an event file with the -e switch"
  exit
fi

if [ "${VERBOSE}" == "" ]
then
  VERBOSE=1
fi
lambda-local -l functions/${FUNCTION}/index.js -e ${EVENT} -v ${VERBOSE}
