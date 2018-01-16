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
    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

# debug
#echo FUNCTION  = "${FUNCTION}"

# error handling
if [[ -n $1 ]]; then
    echo "Last line of file specified as non-opt/last argument:"
    tail -1 "$1"
fi

if [ "${FUNCTION}" == "" ]
then
  echo "Missing function ${FUNCTION}. Please call a function with the -f switch. Example: -f weather"
  exit
fi

found=false
for f in functions/*; do
    if [[ -d $f ]]; then
        if [ $(basename "$f") == ${FUNCTION} ]
        then
          found=true
          break
        fi
    fi
done

# test call
if [ $found != true ]
then
  echo "Function ${FUNCTION} not found. Please check the function names in the functions folder"
  exit
else
  # test
  echo "Running \"${FUNCTION}\" unit tests"
  for f in functions/${FUNCTION}/tests/unit_tests/*; do
    echo "Running \"$f\" unit tests"
    eval $f
  done
fi
