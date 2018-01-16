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
  echo "Missing function name. Please call a function with the -f switch. Example: -f weather"
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
  echo "Function name not found. Please check the function names in the functions folder"
  exit
else
  # clean
  echo "1/4 - Preparing function ${FUNCTION} deployment"
  rm -rf ${FUNCTION}.zip
  # build
  echo "2/4 - Building function ${FUNCTION}"
  apex build ${FUNCTION} > ${FUNCTION}.zip
  # deploy
  echo "3/4 - Uploading function ${FUNCTION} to AWS"
  apex deploy ${FUNCTION} --zip ${FUNCTION}.zip
  # clean
  echo "4/4 - Cleaning artifacts from build of function ${FUNCTION}"
  rm -rf ${FUNCTION}.zip
  echo "Function ${FUNCTION} succesfully deployed!"
fi
